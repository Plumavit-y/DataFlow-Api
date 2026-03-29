/**
 * @file Async error-handling wrapper for Express route handlers.
 * @module utils/asyncHandler
 */

/**
 * Wraps an async Express route handler so that any rejected promise is
 * automatically forwarded to Express's `next` error middleware instead of
 * causing an unhandled-rejection crash.
 *
 * @param {function(import('express').Request, import('express').Response, import('express').NextFunction): Promise<*>} fn
 *   Async route handler to wrap.
 * @returns {function(import('express').Request, import('express').Response, import('express').NextFunction): void}
 *   Express-compatible middleware function.
 *
 * @example
 * router.get('/example', asyncHandler(async (req, res) => {
 *   const data = await fetchData();
 *   res.json(data);
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
