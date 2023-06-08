const {isDev} = require('./lib/constants');

if (isDev)
  require('dotenv').config();

const app = require('./lib/app');

const PORT = process.env.PORT || 2020;

app.listen(PORT, () => console.log(`App listen on port ${PORT}`));
