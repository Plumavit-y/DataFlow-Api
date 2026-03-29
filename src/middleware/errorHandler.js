/**
 * @file Global error-handling and 404 middleware for Express.
 * @module middleware/errorHandler
 */

/**
 * Handles requests to routes that do not exist.
 *
 * Returns a `404` JSON response containing the requested path so clients can
 * diagnose typos or incorrect base URLs.
 *
 * @param {import('express').Request}  req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
};

/**
 * Centralised Express error handler.
 *
 * Converts any error forwarded via `next(err)` into a structured JSON
 * response. {@link module:utils/errors~ApiError} instances are rendered using
 * their own `status` code; all other errors default to `500`.
 *
 * In non-production environments the full stack trace is included in the
 * response to aid debugging.
 *
 * @param {Error & { status?: number }} err - The error object.
 * @param {import('express').Request}  req  - Express request object.
 * @param {import('express').Response} res  - Express response object.
 * @param {import('express').NextFunction} next - Next middleware function
 *   (required so Express recognises this as a 4-argument error handler).
 */
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
