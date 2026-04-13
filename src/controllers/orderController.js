const ApiError = require('../utils/errors');
const { store, getNextOrderId } = require('../data/store');
const { validateOrderPayload } = require('../utils/validators');
const { logEvent } = require('../data/activityLog');

const createOrder = (req, res, next) => {
  const validation = validateOrderPayload(req.body.items);
  if (!validation.valid) {
    return next(new ApiError(validation.message, 400));
  }

  const items = validation.items;
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = store.products.find((p) => p.id === item.productId);
    if (!product) {
      return next(new ApiError(`Product ${item.productId} not found`, 400));
    }

    if (product.stock < item.quantity) {
      return next(new ApiError(`Insufficient stock for ${product.name}`, 400));
    }

    const subtotal = product.price * item.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal,
    });

    total += subtotal;
    product.stock -= item.quantity;
  }

  const order = {
    id: getNextOrderId(),
    userId: req.user.id,
    items: orderItems,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);

  logEvent({
    type: 'orders.create',
    summary: `Nueva orden #${order.id} por ${req.user.email}`,
    details: { userId: req.user.id, total },
  });

  res.status(201).json({
    message: 'Order created successfully',
    order,
  });
};

const listOrders = (req, res) => {
  const userOrders = store.orders.filter((o) => o.userId === req.user.id);

  logEvent({
    type: 'orders.list',
    summary: `Órdenes listadas para ${req.user.email}`,
    details: { count: userOrders.length },
  });

  res.json({
    count: userOrders.length,
    orders: userOrders,
  });
};

const getOrder = (req, res, next) => {
  const order = store.orders.find(
    (o) => o.id === Number(req.params.id) && o.userId === req.user.id
  );

  if (!order) {
    return next(new ApiError('Order not found', 404));
  }

  logEvent({
    type: 'orders.get',
    summary: `Orden consultada #${order.id}`,
    details: { userId: req.user.id, orderId: order.id },
  });

  res.json(order);
};

module.exports = {
  createOrder,
  listOrders,
  getOrder,
};
