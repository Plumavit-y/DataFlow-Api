const endpoints = [
  {
    category: 'Authentication',
    items: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        params: { email: 'string', password: 'string', name: 'string' },
        response: { success: true, user: { id: 'uuid', email: 'string', name: 'string' } },
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login user and get JWT token',
        params: { email: 'string', password: 'string' },
        response: { success: true, token: 'string', user: { id: 'uuid', email: 'string' } },
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current user profile',
        headers: { Authorization: 'Bearer {token}' },
        response: { success: true, user: { id: 'uuid', email: 'string', name: 'string' } },
      },
    ],
  },
  {
    category: 'Products',
    items: [
      {
        method: 'GET',
        path: '/api/products',
        description: 'List all products',
        response: { success: true, products: [{ id: 'number', name: 'string', price: 'number' }] },
      },
      {
        method: 'GET',
        path: '/api/products/:id',
        description: 'Get product by ID',
        response: { success: true, product: { id: 'number', name: 'string', price: 'number' } },
      },
      {
        method: 'POST',
        path: '/api/products',
        description: 'Create new product (admin only)',
        headers: { Authorization: 'Bearer {token}' },
        params: { name: 'string', price: 'number' },
        response: { success: true, product: { id: 'number', name: 'string', price: 'number' } },
      },
      {
        method: 'PUT',
        path: '/api/products/:id',
        description: 'Update product (admin only)',
        headers: { Authorization: 'Bearer {token}' },
        params: { name: 'string (optional)', price: 'number (optional)' },
        response: { success: true, product: { id: 'number', name: 'string', price: 'number' } },
      },
      {
        method: 'DELETE',
        path: '/api/products/:id',
        description: 'Delete product (admin only)',
        headers: { Authorization: 'Bearer {token}' },
        response: { success: true, message: 'Product deleted' },
      },
    ],
  },
  {
    category: 'Orders',
    items: [
      {
        method: 'POST',
        path: '/api/orders',
        description: 'Create new order',
        headers: { Authorization: 'Bearer {token}' },
        params: { productId: 'number', quantity: 'number' },
        response: { success: true, order: { id: 'uuid', productId: 'number', total: 'number' } },
      },
      {
        method: 'GET',
        path: '/api/orders',
        description: 'List user orders',
        headers: { Authorization: 'Bearer {token}' },
        response: { success: true, orders: [{ id: 'uuid', productId: 'number', total: 'number' }] },
      },
      {
        method: 'GET',
        path: '/api/orders/:id',
        description: 'Get order details',
        headers: { Authorization: 'Bearer {token}' },
        response: { success: true, order: { id: 'uuid', productId: 'number', total: 'number' } },
      },
    ],
  },
  {
    category: 'Statistics',
    items: [
      {
        method: 'GET',
        path: '/api/stats',
        description: 'Get API statistics',
        response: {
          success: true,
          stats: { totalUsers: 'number', totalOrders: 'number', totalSpent: 'number' },
        },
      },
    ],
  },
  {
    category: 'System',
    items: [
      {
        method: 'GET',
        path: '/api/health',
        description: 'Health check endpoint',
        response: {
          success: true,
          status: 'operational',
          users: 'number',
          products: 'number',
          orders: 'number',
        },
      },
      {
        method: 'GET',
        path: '/api/events',
        description: 'Get activity log events',
        response: {
          success: true,
          events: [{ id: 'uuid', type: 'string', summary: 'string', timestamp: 'date' }],
        },
      },
    ],
  },
];

module.exports = { endpoints };
