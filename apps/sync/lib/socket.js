const {Server} = require('socket.io');
const jwt = require('jsonwebtoken');

const authMiddleware = (socket, next) => {
  const {token} = socket.handshake.auth;

  const {bucket} = jwt.verify(token, process.env.JWT_SECRET);

  console.log(bucket);

  socket.bucket = bucket;

  socket.join(bucket);

  next();
}

module.exports = http => {
  const io = new Server(http);

  io.use(authMiddleware);

  return io;
}
