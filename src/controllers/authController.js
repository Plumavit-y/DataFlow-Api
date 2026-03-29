/**
 * @file Authentication controller – register, login, and profile endpoints.
 * @module controllers/authController
 */

const bcrypt = require('bcryptjs');
const { store, getNextUserId } = require('../data/store');
const ApiError = require('../utils/errors');
const { validateEmail, validatePassword } = require('../utils/validators');
const { createToken } = require('../utils/token');
const { logEvent } = require('../data/activityLog');

/**
 * Registers a new user account.
 *
 * Validates the request body, hashes the password, persists the user to the
 * in-memory store, and returns a signed JWT token together with the new user's
 * public profile.
 *
 * @type {import('express').RequestHandler}
 */
const register = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return next(new ApiError('Email, password, and name are required', 400));
  }

  if (!validateEmail(email)) {
    return next(new ApiError('Invalid email format', 400));
  }

  if (!validatePassword(password)) {
    return next(new ApiError('Password must be at least 6 characters', 400));
  }

  const existingUser = store.users.find((u) => u.email === email);
  if (existingUser) {
    return next(new ApiError('Email already registered', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: getNextUserId(),
    email,
    name,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  store.users.push(user);

  logEvent({
    type: 'auth.register',
    summary: `Nuevo registro: ${email}`,
    details: { userId: user.id, role: user.role }
  });

  const token = createToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, email: user.email, name: user.name },
    token
  });
};

/**
 * Authenticates a user with email and password.
 *
 * Verifies the provided credentials against the stored bcrypt hash and, on
 * success, returns a signed JWT token together with the user's public profile.
 *
 * @type {import('express').RequestHandler}
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError('Email and password are required', 400));
  }

  const user = store.users.find((u) => u.email === email);
  if (!user) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return next(new ApiError('Invalid credentials', 401));
  }

  logEvent({
    type: 'auth.login',
    summary: `Login exitoso: ${email}`,
    details: { userId: user.id, role: user.role }
  });

  const token = createToken(user);

  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
};

/**
 * Returns the profile of the currently authenticated user.
 *
 * Requires a valid JWT token (attached to `req.user` by
 * {@link module:middleware/auth~authenticateToken}).
 *
 * @type {import('express').RequestHandler}
 */
const me = (req, res, next) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  });
};

module.exports = {
  register,
  login,
  me
};
