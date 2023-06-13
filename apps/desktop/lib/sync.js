const {mkdir, createReadStream, createWriteStream, exists} = require('fs');
const FormData = require('form-data');
const chokidar = require('chokidar');
const axios = require('axios');
const {join} = require('path');

let token = null;

const {getConfigData, serverHost} = require('./auth');
const {syncedDir} = require('./constants');
const {initSocket} = require('./socket');


function filterPath(filePath) {
  return filePath.replace(syncedDir, '').slice(1);
}

async function uploadFile(filePath) {
  const relativeFilePath = filterPath(filePath);

  const existsResponse = await axios.get(`${serverHost}/file/exists/${relativeFilePath}`, {
    headers: {
      authorization: `Bearer ${token}`
    },
  });

  const {exists: existsFile} = existsResponse.data;

  if (existsFile)
    return;

  const body = new FormData();

  body.append('path', relativeFilePath.replace(/\\/g, '/'));
  body.append('file', createReadStream(filePath));

  const formHeaders = body.getHeaders();

  await axios.post(`${serverHost}/file`, body, {
    headers: {
      ...formHeaders,
      authorization: `Bearer ${token}`
    },
  });
}

async function syncFiles() {
  const listResponse = await axios.get(`${serverHost}/file`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const {data, bucket} = listResponse.data;

  data.forEach(e => downloadFile(e.Key, bucket));
}

async function downloadFile(filePath, bucket) {

  const localFilePath = join(syncedDir, filePath);

  exists(localFilePath, existsFile => {
    if (existsFile)
      return;

    const splittedPath = localFilePath.split(/\/|\\/);
    const localFileDirPath = splittedPath.slice(0, splittedPath.length - 1).join('/');

    mkdir(localFileDirPath, {recursive: true}, async (err, data) => {
      if (err)
        throw err;

      const res = await axios.get(`${serverHost}/file/${bucket}/${filePath}?type=raw`, {
        responseType: 'stream'
      });

      res.data.pipe(createWriteStream(localFilePath));
    });
  });  
}


async function deleteFile(filePath) {
  const relativeFilePath = filterPath(filePath);

  const res = await axios.delete(`${serverHost}/file/${relativeFilePath}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
}

function handleNewFile({path, bucket}) {

  const fullPath = join(syncedDir, path);

  exists(fullPath, existsFile => {
    if (!existsFile)
      downloadFile(path, bucket);
  })
}

function handleDeleteFile({path}) {
  const fullPath = join(syncedDir, path);

  exists(fullPath, existsFile => {
    if (existsFile) {
      //TODO: Remove Files
    }
  })
}

async function startSync() {
  const {token: authToken} = await getConfigData();

  if (!authToken)
    return;

  token = authToken;

  const watcher = chokidar.watch(syncedDir, {ignored: /^\./, persistent: true});
  
  await syncFiles();
  
  initSocket(token, handleNewFile, handleDeleteFile);

  watcher
    .on('add', uploadFile)
    .on('change', uploadFile)
    .on('unlink', deleteFile);
}

