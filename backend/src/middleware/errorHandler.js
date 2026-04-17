const logger = require('../utils/logger');

const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message || err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Something went wrong!' : message,
    message: process.env.NODE_ENV === 'development' ? message : undefined,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
