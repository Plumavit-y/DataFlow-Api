const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
    status
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
