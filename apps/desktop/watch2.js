const {mkdirSync, existsSync, writeFileSync, mkdir, createReadStream, createWriteStream, exists} = require('fs');
const {io} = require('socket.io-client');
const FormData = require('form-data');
const chokidar = require('chokidar');
const axios = require('axios');
const {join} = require('path');
const os = require('os');

const homePath = os.homedir();

const syncedFolder = join(homePath, 'Documents', 'SAGA Sync');
const configDir = join(process.env.APPDATA, 'SAGA');
const authFile = join(configDir, 'auth.json');

const {token} = require(authFile);

const socket = io('http://localhost:2020', {
  auth: {
    token
  }
});

function filterPath(filePath) {
  return filePath.replace(syncedFolder, '').slice(1);
}

async function uploadFile(filePath) {
  const relativeFilePath = filterPath(filePath);

  const existsResponse = await axios.get(`http://localhost:2020/file/exists/${relativeFilePath}`, {
    headers: {
      authorization: `Bearer ${token}`
    },
  });

  const {exists} = existsResponse.data;

  if (exists)
    return;

  const body = new FormData();

  body.append('path', relativeFilePath.replace(/\\/g, '/'));
  body.append('file', createReadStream(filePath));

  const formHeaders = body.getHeaders();

  await axios.post('http://localhost:2020/file', body, {
    headers: {
      ...formHeaders,
      authorization: `Bearer ${token}`
    },
  });
}

async function syncFiles() {
  const listResponse = await axios.get('http://localhost:2020/file', {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const {data, bucket} = listResponse.data;
  console.log(data);
  data.forEach(e => downloadFile(e.Key, bucket));
}

async function downloadFile(filePath, bucket) {

  const localFilePath = join(syncedFolder, filePath);

  exists(localFilePath, existsFile => {
    if (existsFile)
      return;

    const splittedPath = localFilePath.split(/\/|\\/);
    const localFileDirPath = splittedPath.slice(0, splittedPath.length - 1).join('/');

    mkdir(localFileDirPath, {recursive: true}, async (err, data) => {
      if (err)
        throw err;

      const res = await axios.get(`http://localhost:2020/file/${bucket}/${filePath}?type=raw`, {
        responseType: 'stream'
      });

      res.data.pipe(createWriteStream(localFilePath));
    });
  });  
}


async function deleteFile(filePath) {
  const relativeFilePath = filterPath(filePath);

  const res = await axios.delete(`http://localhost:2020/file/${relativeFilePath}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
}

function handleNewFile({path, bucket}) {

  const fullPath = join(syncedFolder, path);

  exists(fullPath, existsFile => {
    if (!existsFile)
      downloadFile(path, bucket);
  })
}

function handleDeleteFile({path}) {
  const fullPath = join(syncedFolder, path);

  exists(fullPath, existsFile => {
    console.log('Delete', existsFile);

    if (existsFile) {
      //TODO: Download File
    }
  })
}


(async function() {
  const existsSyncedFolder = existsSync(syncedFolder);
  const existsConfigFolder = existsSync(configDir);

  if (!existsSyncedFolder) {
    mkdirSync(syncedFolder);
    //TODO: Create sub process to download data
  }

  if (!existsConfigFolder) {
    mkdirSync(configDir);

    writeFileSync(join(configDir, 'auth.json'), '{}');
  }

  await syncFiles();

  const watcher = chokidar.watch(syncedFolder, {ignored: /^\./, persistent: true});

  socket
    .on('file:new', handleNewFile)
    .on('file:delete', handleDeleteFile);

  watcher
    .on('add', uploadFile)
    .on('change', uploadFile)
    .on('unlink', deleteFile);

})();
