const schema = require('./schema');
const mongoose = require('../mongoose');

module.exports = mongoose.models.Device || mongoose.model('Device', schema);
