const bcrypt = require('bcryptjs');

const createInitialProducts = () => [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 129.99,
    category: 'Electronics',
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    category: 'Sports',
    stock: 100,
    createdAt: new Date().toISOString()
  }
];

const createDefaultAdmin = () => ({
  id: 1,
  email: 'admin@portfolio.dev',
  name: 'Portfolio Admin',
  password: bcrypt.hashSync('Admin123!', 10),
  role: 'admin',
  createdAt: new Date().toISOString()
});

const store = {
  users: [],
  products: [],
  orders: [],
  nextUserId: 1,
  nextOrderId: 1
};

const resetStore = () => {
  store.users = [createDefaultAdmin()];
  store.products = createInitialProducts();
  store.orders = [];
  store.nextUserId = 2;
  store.nextOrderId = 1;
};

resetStore();

const getNextUserId = () => store.nextUserId++;
const getNextOrderId = () => store.nextOrderId++;

module.exports = {
  store,
  getNextUserId,
  getNextOrderId,
  resetStore
};
