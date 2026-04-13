const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret: JWT_SECRET, expiresIn } = config.jwt;

const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = {
  createToken,
  JWT_SECRET,
};
