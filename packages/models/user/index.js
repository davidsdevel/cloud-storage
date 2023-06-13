const schema = require('./schema');
const mongoose = require('../mongoose');

module.exports = mongoose.models.User || mongoose.model('User', schema);