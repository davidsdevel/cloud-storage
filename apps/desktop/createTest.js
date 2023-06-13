const axios = require('axios');
const {serverHost} = require('./lib/constants');

axios.post(`${serverHost}/auth/signup`, {
  name: 'David',
  lastname: 'Gonzalez',
  email: 'davidsdevel@gmail.com',
  password: '7530357K-pop'
}).then(console.log);
