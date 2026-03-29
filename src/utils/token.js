/**
 * @file JWT token creation utility.
 * @module utils/token
 */

const jwt = require('jsonwebtoken');

/**
 * Secret used to sign and verify JWT tokens.
 * Set via the `JWT_SECRET` environment variable in production.
 *
 * @type {string}
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Creates a signed JWT token for the given user.
 *
 * The token payload contains the user's `id`, `email`, and `role`, and the
 * token expires after **24 hours**.
 *
 * @param {{ id: number, email: string, role: string }} user - User object whose
 *   data should be embedded in the token payload.
 * @returns {string} Signed JWT string.
 *
 * @example
 * const token = createToken({ id: 1, email: 'user@example.com', role: 'user' });
 */
const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  createToken,
  JWT_SECRET
};
