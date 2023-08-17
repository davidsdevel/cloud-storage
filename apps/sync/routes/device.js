const authMiddleware  = require('../middlewares/auth');
const Bucket = require('models/bucket');
const Device = require('models/device');
const {Router} = require('express');
const router = Router();

router.use(authMiddleware);

/**
 * Get All Devices
 */
router.get('/', async (req, res) => {
  const {bucket} = req.user;

  const data = await Device.find({bucket}, null, {lean: true});

  res.json({
    data
  });
});

/**
 * Add Device
 */
router.post('/', async (req, res, next) => {
  const {user, body} = req;
  const {bucket} = user;
  const {type, model, platform} = body;

  try {
    const {_id} = await Device.create({
      bucket,
      deviceType: type,
      platform,
      model
    });

    await Bucket.incrementDevices(bucket);

    res.json({
      id: _id
    });
  } catch(err) {
    next(err);
  }
});


/**
 * Get Single Device
 */
router.get('/:id', async (req, res) => {
  const {user, params} = req;
  const {bucket} = user;
  const {id} = params;

  const data = await Device.findOne({_id: id, bucket}, null, {lean: true});

  res.json(data);
});

/**
 * Update Device
 */
router.patch('/:id/sync', async (req, res) => {
  const {user, params} = req;
  const {bucket} = user;
  const {id} = params;

  await Device.updateOne({_id: id, bucket}, {lastSync: Date.now()});

  res.json({
    status: 'OK'
  });
});

/**
 * Delete device
 */
router.delete('/:id', async (req, res) => {

}); 

module.exports = router;
