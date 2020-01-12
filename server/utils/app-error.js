class AppError extends Error {
  constructor(message, statusCode, body = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.body = body;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
