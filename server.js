const config = require('./src/config');
const app = require('./src/app');

const port = config.server.port;
const env = config.env;

let server;

const startServer = () => {
  server = app.listen(port, () => {
    const padding = ' '.repeat(36);
    console.log(`
╔═══════════════════════════════════════════════════════╗
║           🚀 DataFlow API Server Running!                ║
╠═══════════════════════════════════════════════════════╣
║  Environment:     ${env}${padding.slice(env.length)}║
║  Port:            ${port}${padding.slice(port.toString().length)}║
║  URL:             http://localhost:${port}${' '.repeat(15)}║
║  API Health:      http://localhost:${port}/api/health${' '.repeat(12)}║
║  Swagger Docs:   http://localhost:${port}/api-docs${' '.repeat(14)}║
╚═══════════════════════════════════════════════════════╝

 Available Endpoints:
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AUTH:
   POST   /api/auth/register   - Register new user
   POST   /api/auth/login      - Login user
   GET    /api/auth/me         - Get profile

 PRODUCTS:
   GET    /api/products      - List products
   GET    /api/products/:id - Get product
   POST   /api/products     - Create product (admin)
   PUT    /api/products/:id - Update product
   DELETE /api/products/:id - Delete product

 ORDERS:
   POST   /api/orders    - Create order
   GET    /api/orders   - List orders
   GET    /api/orders/:id - Get order

 STATS:
   GET    /api/stats           - Dashboard stats
   GET    /api/health         - Health check
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });

  return server;
};

const gracefulShutdown = (signal) => {
  console.log(`\n📦 Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close((err) => {
      if (err) {
        console.error('❌ Error during server shutdown:', err);
        process.exit(1);
      }
      console.log('✅ Server closed successfully');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('❌ Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = app;
