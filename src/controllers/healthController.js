const { store } = require('../data/store');
const { logEvent } = require('../data/activityLog');

const getHealth = (req, res) => {
  logEvent({
    type: 'api.health',
    summary: 'Chequeo de salud solicitado',
    details: {
      users: store.users.length,
      products: store.products.length,
      orders: store.orders.length
    }
  });

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      users: store.users.length,
      products: store.products.length,
      orders: store.orders.length
    }
  });
};

module.exports = {
  getHealth
};
