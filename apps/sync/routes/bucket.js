const {Router} = require('express');
const Bucket = require('models/bucket');
const router = Router();
const authMiddleware  = require('../middlewares/auth');

router.use(authMiddleware);

/**
 * Get All Devices
 */
router.get('/', async (req, res) => {
  const {bucket} = req.user;

  const data = await Bucket.findOne({name: bucket}, null, {lean: true});

  res.json(data);
});

module.exports = router;
