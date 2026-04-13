const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/token');

const AUTHENTICATION_TYPE = 'Bearer';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith(`${AUTHENTICATION_TYPE} `)
      ? authHeader.substring(AUTHENTICATION_TYPE.length + 1)
      : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const message =
        err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid or expired token';
      return res.status(403).json({ error: message });
    }

    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith(`${AUTHENTICATION_TYPE} `)
      ? authHeader.substring(AUTHENTICATION_TYPE.length + 1)
      : null;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireRole,
};
