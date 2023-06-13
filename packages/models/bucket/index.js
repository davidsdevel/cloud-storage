const schema = require('./schema');
const mongoose = require('../mongoose');

module.exports = mongoose.models.Bucket || mongoose.model('Bucket', schema);
