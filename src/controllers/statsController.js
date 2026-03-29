const { store } = require('../data/store');
const { logEvent } = require('../data/activityLog');

const getStats = (req, res) => {
  const userOrders = store.orders.filter((order) => order.userId === req.user.id);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = userOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  logEvent({
    type: 'stats.view',
    summary: `Estadísticas consultadas por ${req.user.email}`,
    details: { totalOrders, totalSpent }
  });

  res.json({
    totalSpent: totalSpent.toFixed(2),
    totalOrders,
    avgOrderValue: avgOrderValue.toFixed(2),
    recentOrders: userOrders.slice(-5).reverse()
  });
};

module.exports = {
  getStats
};
