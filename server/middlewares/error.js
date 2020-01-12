const AppError = require('../utils/app-error');

const handleValidationErrorDB = err => {
  const errors = Object.keys(err.errors).map(key => ({
    [key]: err.errors[key].message
  }));
  const message = `Invalid input data`;
  return new AppError(message, 400, errors);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = err => {
  return new AppError('Invalid Token', 400);
};

const sendDevError = (err, res) => {
  let { statusCode, status, message, body, stack } = err;
  statusCode = statusCode || 500;
  let response = {
    status: status,
    message: message,
    error: err,
    stack: stack
  };
  if (body) {
    response.errors = body;
  }
  res.status(statusCode).json(response);
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    let { statusCode, status, message, body } = err;
    statusCode = statusCode || 500;
    status = status || 'error';
    let response = {
      status: status,
      message: message
    };
    if (body) {
      response.errors = body;
    }
    res.status(statusCode).json(response);
  } else {
    console.log('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);

    sendProdError(error, res);
  } else {
    sendDevError(err, res);
  }
};
