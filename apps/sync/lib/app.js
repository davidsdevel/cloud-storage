const {createServer} = require('http');
const express = require('express');
const socket = require('./socket');
const {join} = require('path');
const cors = require('cors');

const fileRouter = require('../routes/files');
const authRouter = require('../routes/auth');

const app = express();

const http = createServer(app);

const io = socket(http);

app.use(express.static(join(__dirname, '../public')));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.all('*', (req, res) => res.sendStatus(404))

module.exports = http;