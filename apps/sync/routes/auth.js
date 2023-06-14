const {createBucket}  = require('../lib/operations');
const {Router} = require('express');
const User = require('models/user');
const Bucket = require('models/bucket');
const crypto = require('crypto');
const router = Router();

/**
 * Login
 */
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  const token = await User.login(email, password);

  if (!token)
    return res.status(400).json({
      message: 'Invalid credetials'
    });

  res.json({
    token
  });
});


router.post('/signup', async (req, res) => {
  const {name, lastname, email, password} = req.body;

  const bucket = crypto.randomUUID();

  const userId = await User.createUser({
    name,
    lastname,
    email,
    password,
    bucket
  });

  if (!userId)
    return res.status(400).json({
      message: 'Error creating account'
    });

  await Promise.all([
    createBucket(bucket),
    Bucket.create({
      name: bucket,
      owner: userId
    })
  ]);

  res.sendStatus(201);
});

module.exports = router;
