const jwt = require('jsonwebtoken');

module.exports = async function authMiddleware(req, res, next) {
  const {authorization} = req.headers;

  if (!authorization)
    return res.status(400).json({
      message: 'Missing authorization header'
    });

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer')
    return res.status(401).json({
      message: 'Invalid token type'
    });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    next();
  } catch(err) {
    switch(err?.name) {
      case 'TokenExpiredError':
        return res.status(401).json({
          message: 'expired token'
        });
      case 'JsonWebTokenError':
        return res.status(401).json({
          message: err.message
        });
      default:
        return res.status(500).json(err);
    }
  }
};
