/**
 * @file Server entry point.
 *
 * Starts the HTTP server on the configured port and prints a startup summary
 * to the console. Import `src/app.js` directly in tests to avoid binding a
 * port during test runs.
 */

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
🚀 DataFlow API Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
📚 Docs: http://localhost:${PORT}/api/health

Available Endpoints:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH:
  POST /api/auth/register - Register new user
  POST /api/auth/login    - Login user
  GET  /api/auth/me       - Get profile

PRODUCTS:
  GET    /api/products     - List products
  GET    /api/products/:id - Get product
  POST   /api/products     - Create product (admin)
  PUT    /api/products/:id - Update product
  DELETE /api/products/:id - Delete product

ORDERS:
  POST   /api/orders       - Create order
  GET    /api/orders       - List orders
  GET    /api/orders/:id   - Get order

STATS:
  GET /api/stats           - Dashboard stats
  GET /api/health          - Health check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

module.exports = app;
