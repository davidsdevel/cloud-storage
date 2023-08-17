const {getFile, uploadFile, deleteFile, existsFile, listFiles}  = require('../lib/operations');
const authMiddleware  = require('../middlewares/auth');
const Bucket = require('models/bucket');
const {Router} = require('express');
const multer  = require('multer');
const os = require('os');

const tempDir = os.tmpdir();

const upload = multer({
  limits: {
    fieldSize: 25 * 1024 * 1024
  },
  dest: tempDir
});

const router = Router();

/**
 * Get files
 */
router.get('/:bucket/*', async (req, res, next) => {
  if (req.path.startsWith('/exists/'))
    return next();

  const {type = 'json'} = req.query;
  const {bucket} = req.params;
  const path = req.path.replace(`/${bucket}/`, '');

  try {
    const file = await getFile(bucket, decodeURI(path));

    if (type === 'raw') {
      res.setHeader('content-type', file.ContentType);

      res.send(file.Body);

    } else if (type === 'json') {
      delete file.Body;

      res.json(file);
    } else {
      res.status(400).json({
        message: 'Type must be json or raw'
      });
    }
  } catch(err) {
    if (err.code === 'NoSuchKey')
      return res.status(404).json({
        message: 'File doesn\'t found'
      });

    return next(err);
  }
});

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  const {bucket} = req.user;

  try {
    const data = await listFiles(bucket);

    res.send({
      bucket,
      data
    });
  } catch(err) {
    return next(err);
  }
});


/**
 * Get files
 */
router.get('/exists/*', async (req, res, next) => {
  const {bucket} = req.user;
  const path = req.path.replace('/exists/', '');

  try {
    const exists = await existsFile(bucket, path);

    res.json({
      exists
    });
  } catch(err) {
    return next(err);
  }
});

/**
 * Upload Files
 */
router.post('/', upload.single('file'), async (req, res) => {
  const {bucket} = req.user;
  const {path, type, magnet} = req.body;
  const {file} = req;
  
  const exists = await existsFile(bucket, path);

  if (exists)
    return res.json({});

  const response = await uploadFile(bucket, path, file.path, {
    ContentType: file.mimetype
  });

  if(type === 'upload') {
    await Bucket.incrementStorage(bucket, file.size);
    
    req.io.to(bucket).emit('file:new', {path, magnet});
    req.io.to(bucket).emit('storage:update', file.size);
  }

  else if (type === 'update') {
    const file = await getFile(bucket, decodeURI(path));

    const sizeDifference = file.ContentLength - file.size;
    
    await Bucket.incrementStorage(bucket, file.size);

    req.io.to(bucket).emit('file:update', {path, magnet});
    req.io.to(bucket).emit('storage:update', sizeDifference);
  }

  //TODO Modify response
  res.json({});
});

/**
 * Delete Files
 */
router.delete('*', async (req, res) => {
  const {bucket} = req.user;

  const path = req.path.slice(1);

  const response = await deleteFile(bucket, decodeURI(path));
  await Bucket.decrementStorage(bucket, response.ContentLength);

  req.io.to(bucket).emit('storage:update', -response.ContentLength);  
  req.io.to(bucket).emit('file:delete', {path});

  //TODO Modify response
  res.json({});
});

module.exports = router;
