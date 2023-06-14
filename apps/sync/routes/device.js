const {Router} = require('express');
const Bucket = require('models/bucket');
const Device = require('models/device');
const router = Router();


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
router.post('/', async (req, res) => {
  const {user, body} = req;
  const {bucket} = user;
  const {type, model, platform} = body;

  await Device.create({
    bucket,
    deviceType: type,
    platform,
    model
  });

  await Bucket.incrementDevices(bucket);

  res.json({
    status: 'OK'
  });
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
