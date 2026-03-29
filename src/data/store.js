/**
 * @file In-memory data store and seed helpers.
 *
 * Provides the shared `store` object that acts as the application's runtime
 * database, together with helper functions to generate sequential IDs and to
 * reset the store to its initial seed state (primarily used in tests).
 *
 * @module data/store
 */

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

/**
 * Shared in-memory store for users, products, and orders.
 *
 * @type {{ users: object[], products: object[], orders: object[], nextUserId: number, nextOrderId: number }}
 */
const store = {
  users: [],
  products: [],
  orders: [],
  nextUserId: 1,
  nextOrderId: 1
};

/**
 * Resets the store to its initial seed state.
 *
 * Populates `store.users` with the default admin account, `store.products`
 * with the three seed products, clears all orders, and resets the ID
 * counters. Called automatically on module load and before each test.
 */
const resetStore = () => {
  store.users = [createDefaultAdmin()];
  store.products = createInitialProducts();
  store.orders = [];
  store.nextUserId = 2;
  store.nextOrderId = 1;
};

resetStore();

/**
 * Returns the next available user ID and increments the counter.
 *
 * @returns {number} Next user ID.
 */
const getNextUserId = () => store.nextUserId++;

/**
 * Returns the next available order ID and increments the counter.
 *
 * @returns {number} Next order ID.
 */
const getNextOrderId = () => store.nextOrderId++;

module.exports = {
  store,
  getNextUserId,
  getNextOrderId,
  resetStore
};
