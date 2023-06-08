const { cert, initializeApp, getApps } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const {mkdirSync, existsSync, writeFileSync, mkdir, createReadStream, createWriteStream} = require('fs');
const chokidar = require('chokidar');
const {join} = require('path');
const os = require('os');

const homePath = os.homedir();
const configDir = join(process.env.APPDATA, 'SAGA');
const authFile = join(configDir, 'auth.json');
const syncedFolder = join(homePath, 'Documents', 'SAGA Sync');

const serviceAccount = require(authFile);

function initializeFirebase() {
  const apps = getApps();

  return apps.length
    ? apps[0]
    : initializeApp({
        credential: cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      });
}

function filterPath(filePath) {
  return filePath.replace(syncedFolder, '').slice(1);
}

/**
 * Get Bucket
 *
 */
function getBucket() {
  return getStorage().bucket();
}

async function uploadFile(filePath) {

  const relativeFilePath = filterPath(filePath);

  const bucket = getBucket();
  const file = bucket.file(relativeFilePath);
  const [existsFile] = await file.exists();

  if (existsFile)
    return Promise.resolve();

  const readStream = createReadStream(filePath);
  const writeStream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    const stream = readStream.pipe(writeStream);

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function updateFile(filePath) {
  const relativeFilePath = filterPath(filePath);

  const bucket = getBucket();
  const file = bucket.file(relativeFilePath);

  const readStream = createReadStream(filePath);
  const writeStream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    const stream = readStream.pipe(writeStream);

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function listFiles() {
  const bucket = getBucket();

  const [files] = await bucket.getFiles();

  return files;
}

async function downloadFile(fileName) {
   const bucket = getBucket();

   const filteredFilePath = filterPath(filePath);

  return bucket
    .file(filteredFilePath)
    .createReadStream()
    .pipe(createWriteStream(fileName));
}

async function downloadAllFiles() {
  const files = await listFiles();

  return files.map(e => {
    const localFilePath = join(syncedFolder, e.name);

    const splittedPath = localFilePath.split(/\/|\\/);
    const localFileDirPath = splittedPath.slice(0, splittedPath.length - 1).join('/');

    return new Promise((resolve, reject) => {
      mkdir(localFileDirPath, {recursive: true}, err => {
        if (err)
          return reject(err);

        const writeStream = createWriteStream(localFilePath);
        const readStream = e.createReadStream();

        readStream.pipe(writeStream);

        readStream.on('finish', resolve);
        readStream.on('error', reject);

      });
    });
  });
}

async function deleteFile(filePath) {
  const filteredPath = filterPath(filePath);
  
  const bucket = getBucket();

  return bucket.file(filteredPath).delete();
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

  initializeFirebase();

  await Promise.all(await downloadAllFiles());

  const watcher = chokidar.watch(syncedFolder, {ignored: /^\./, persistent: true});

  watcher
    .on('add', uploadFile)
    .on('change', updateFile)
    .on('unlink', deleteFile);

})();
