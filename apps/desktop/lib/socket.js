const {mkdirSync, existsSync, writeFileSync, mkdir, createReadStream, createWriteStream, exists} = require('fs');
const {serverHost} = require('./constants');
const {io} = require('socket.io-client');
const FormData = require('form-data');
const chokidar = require('chokidar');
const axios = require('axios');
const {join} = require('path');
const os = require('os');

async function initSocket(token, onNewFile, onDeleteFile) {
  const socket = io(serverHost, {
    auth: {
      token
    }
  });

  socket
    .on('file:new', onNewFile)
    .on('file:delete', onDeleteFile);
}

module.exports = exports = {
  initSocket
};
