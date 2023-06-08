const express = require('express');
const fileRouter = require('../routes/files');
const {join} = require('path');
const cors = require('cors');
const {createServer} = require('http');
const socket = require('./socket');

const app = express();

const http = createServer(app);

const io = socket(http);

app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
  req.io = io;

  next();
})

app.use(cors())

app.use('/file', fileRouter);

module.exports = http;