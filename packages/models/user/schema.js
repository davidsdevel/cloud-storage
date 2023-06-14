const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  bucket: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  lastname: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  }
});

schema.statics.createUser = async function(data) {
  try {
    const password = await bcrypt.hash(data.password, 10);

    const {_id} = await this.create({
      ...data,
      password
    });

    return _id;
  } catch(err) {
    console.log(err);
    return null;
  }
};

schema.statics.login = async function(email, password) {
  const account = await this.findOne({email}, 'password bucket');

  if (!account)
    return null;

  const hasValidPassword = await bcrypt.compare(password, account.password);

  if (!hasValidPassword)
    return null;

  return jwt.sign({
    bucket: account.bucket
  }, process.env.JWT_SECRET);
};

module.exports = schema;
