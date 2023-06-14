const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const os = require('os');

const schema = new mongoose.Schema({
  bucket: {
    type: String,
    required: true 
  },
  deviceType: {
    type: String,
    required: true
  },
  model:{
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  lastSync: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = schema;
