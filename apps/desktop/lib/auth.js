const {exists, writeFile, mkdir} = require('fs');
const {authFilePath, configDir, serverHost} = require('./constants');
const axios = require('axios');

const existsAuthFile =  () =>  (new Promise(resolve => exists(authFilePath, resolve)));

const writeAuthFile = async content => {
  const existsFile = await existsAuthFile();

  if (!existsFile)
    await new Promise(resolve => mkdir(configDir, (err, data) => err ? reject(err) : resolve(data)));

  return new Promise((resolve, reject) => writeFile(authFilePath, content, (err, res) => err ? reject(err) : resolve(res)));
}

const getConfigData = async () => {
  const existsFile = await existsAuthFile();

  if (!existsFile)
    await writeAuthFile('{}');

  return require(authFilePath);
}

const updateAuthFile = async data => {
  const authFile = await getConfigData();

  const newData = {
    ...authFile,
    ...data
  };

  return writeAuthFile(JSON.stringify(newData));
}

const login = async (email, password) => {
  const {data} = await axios.post(`${serverHost}/auth/login`, {
    email,
    password
  });

  const {token} = data;
}

module.exports = exports = {
  getConfigData,
  existsAuthFile,
  updateAuthFile
}