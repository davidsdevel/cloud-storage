const mongoose = require('mongoose')

const mongo = global.mongoose || mongoose;

global.mongoose = mongo;

module.exports = mongoose;
