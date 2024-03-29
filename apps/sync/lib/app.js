const {createServer} = require('http');
const Sentry = require('@sentry/node');
const express = require('express');
const socket = require('./socket');
const {join} = require('path');
const cors = require('cors');

const deviceRouter = require('../routes/device');
const bucketRouter = require('../routes/bucket');
const fileRouter = require('../routes/files');
const authRouter = require('../routes/auth');

const app = express();

const http = createServer(app);

const io = socket(http);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
});

app.use(express.static(join(__dirname, '../public')));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/bucket', bucketRouter);
app.use('/device', deviceRouter);

app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  console.error(err);

  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

module.exports = http;