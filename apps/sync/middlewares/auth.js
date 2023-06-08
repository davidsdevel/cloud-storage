const jwt = require('jsonwebtoken');

module.exports = async function authMiddleware(req, res, next) {
  const {authorization} = req.headers;

  const [_, token] = authorization.split(' ');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    next();
  } catch(err) {
    next(err);
  }
};
