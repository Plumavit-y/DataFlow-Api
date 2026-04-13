require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';

const config = {
  env: nodeEnv,
  isProduction,
  isDevelopment,

  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '1', 10) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || '*',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

if (!config.jwt.secret) {
  if (isProduction) {
    throw new Error('FATAL: JWT_SECRET is required in production environment');
  }
  config.jwt.secret = 'dev-secret-change-in-production-minimum-32-characters-long';
}

if (isDevelopment) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️  DEVELOPMENT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environment: ${config.env}
  Port:        ${config.server.port}
  JWT Secret:  ${config.jwt.secret.substring(0, 8)}... (truncated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

module.exports = config;
