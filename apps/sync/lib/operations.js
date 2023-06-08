const AWS = require('aws-sdk');
const {createReadStream} = require('fs');

function createClient() {
  return new AWS.S3({
    endpoint: 's3.us-east-005.backblazeb2.com',
    region: 'us-west-004'
  });
}

function createBucket(bucketName) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    s3.createBucket({Bucket: bucketName}, (err, data) => {
      if (err)
        return reject(err);

      return resolve(data);
    });
  });
}


function existsFile(bucketName, key) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    s3.headObject(params, (err, data) => {
      if (err && err.name === 'NotFound')
        return resolve(false);
      else if (err)
        return reject(err);
      else  
        return resolve(true);
    });
  });  
}

function listFiles(bucketName) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName
    }

    s3.listObjects(params, (err, data) => {
      if (err)
        return reject(err);

      resolve(data.Contents);
    });
  })
}

function getFile(bucketName, key) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    s3.getObject(params, (err, data) => {
      if (err)
        return reject(err);

      return resolve(data);
    });
  });
}

function uploadFile(bucketName, key, filePath, options) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    const params = {
      ...options,
      Bucket: bucketName,
      Key: key,
      Body: createReadStream(filePath)
    };

    s3.putObject(params, (err, data) => {
      if (err)
        return reject(err);

      return resolve(data);
    });
  });
}

function deleteFile(bucketName, key, filePath) {
  const s3 = createClient();

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    s3.deleteObject(params, (err, data) => {
      if (err)
        return reject(err);

      return resolve(data);
    });
  });
}

module.exports = exports = {
  createBucket,
  getFile,
  uploadFile,
  deleteFile,
  existsFile,
  listFiles
}
