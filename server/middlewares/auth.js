const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

module.exports = (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (decoded.type && decoded.type === 'refresh') {
        return next(new AppError('Unauthorized', 401));
      }
      req.user = decoded;
      next();
    } else {
      return next(new AppError('Unauthorized', 401));
    }
  } catch (e) {
    return next(new AppError('Unauthorized', 401));
  }
};
