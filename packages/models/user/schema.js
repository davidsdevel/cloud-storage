const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
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
  },
  storageSize: {
    type: Number,
    required: true,
    default: 0
  },
  connectedDevices: {
    type: Number,
    required: true,
    default: 0
  }
});

schema.statics.createUser = () => {};

schema.statics.login = () => {};

schema.statics.incrementDevice = () => {};

schema.statics.decrementDevice = () => {};

schema.statics.incrementStorage = () => {};

schema.statics.decrementStorage = () => {};


module.exports = schema;
