const {isDev} = require('./lib/constants');
const mongoose = require('models/mongoose');

if (isDev)
  require('dotenv').config();

const app = require('./lib/app');

const PORT = process.env.PORT || 2020;

(async function() {
  await mongoose.connect(process.env.MONGO_URI);

  app.listen(PORT, () => console.log(`App listen on port ${PORT}`));
})();
