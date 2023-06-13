const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: String
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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


schema.statics.incrementDevices = function(name) {
  return this.updateOne({name}, {$inc: {connectedDevices: 1}});
};

schema.statics.incrementStorage = function(name, bytes) {
  return this.updateOne({name}, {$inc: {storageSize: bytes}});
};

schema.statics.decrementDevices = function(name) {
  return this.updateOne({name}, {$inc: {connectedDevices: -1}});
};

schema.statics.decrementStorage = function(name, bytes) {
  return this.updateOne({name}, {$inc: {storageSize: -bytes}});
};

module.exports = schema;
