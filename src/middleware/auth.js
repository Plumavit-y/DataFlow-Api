/**
 * @file Authentication middleware for Express routes.
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/token');

/**
 * Express middleware that enforces JWT authentication.
 *
 * Reads the `Authorization: Bearer <token>` header, verifies the token, and
 * attaches the decoded user payload to `req.user`. If the token is missing or
 * invalid the request is rejected immediately with a `401` or `403` response.
 *
 * @param {import('express').Request}  req  - Express request object.
 * @param {import('express').Response} res  - Express response object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

/**
 * Express middleware that optionally decodes a JWT token.
 *
 * If a valid `Authorization: Bearer <token>` header is present the decoded
 * payload is attached to `req.user`; otherwise the request continues
 * unauthenticated. No error is returned for missing or invalid tokens.
 *
 * @param {import('express').Request}  req  - Express request object.
 * @param {import('express').Response} res  - Express response object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
    return;
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
