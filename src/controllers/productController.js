/**
 * @file Product catalogue controller – list, get, create, update, and delete products.
 * @module controllers/productController
 */

const ApiError = require('../utils/errors');
const { store } = require('../data/store');
const { validateProductPayload } = require('../utils/validators');
const { logEvent } = require('../data/activityLog');

/**
 * Lists products with optional filtering.
 *
 * Supports the following query parameters:
 * - `category` – case-insensitive category match
 * - `minPrice` / `maxPrice` – numeric price range filter
 * - `search` – substring match against name and category
 *
 * @type {import('express').RequestHandler}
 */
const listProducts = (req, res) => {
  let products = [...store.products];
  const { category, minPrice, maxPrice, search } = req.query;

  if (category) {
    products = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    const parsedMin = parseFloat(minPrice);
    if (!Number.isNaN(parsedMin)) {
      products = products.filter((product) => product.price >= parsedMin);
    }
  }

  if (maxPrice) {
    const parsedMax = parseFloat(maxPrice);
    if (!Number.isNaN(parsedMax)) {
      products = products.filter((product) => product.price <= parsedMax);
    }
  }

  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  logEvent({
    type: 'products.list',
    summary: `Productos listados${req.user ? ` por ${req.user.email}` : ''}`,
    details: { count: products.length }
  });

  res.json({
    count: products.length,
    products
  });
};

/**
 * Returns a single product by its numeric ID.
 *
 * @type {import('express').RequestHandler}
 */
const getProduct = (req, res, next) => {
  const product = store.products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  logEvent({
    type: 'products.get',
    summary: `Consulta del producto ${product.name}`,
    details: { productId: product.id }
  });

  res.json(product);
};

/**
 * Creates a new product. Restricted to users with the `admin` role.
 *
 * @type {import('express').RequestHandler}
 */
const createProduct = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError('Admin role required', 403));
  }

  const validation = validateProductPayload(req.body);
  if (!validation.valid) {
    return next(new ApiError(validation.message, 400));
  }

  const { name, category, stock = 0 } = req.body;
  const stockQuantity = Number.isInteger(stock) ? stock : Number(stock) || 0;

  const product = {
    id: Math.max(...store.products.map((p) => p.id), 0) + 1,
    name,
    price: validation.parsedPrice,
    category,
    stock: stockQuantity,
    createdAt: new Date().toISOString()
  };

  store.products.push(product);

  logEvent({
    type: 'products.create',
    summary: `Producto creado: ${name}`,
    details: { productId: product.id, createdBy: req.user.email }
  });

  res.status(201).json({
    message: 'Product created successfully',
    product
  });
};

/**
 * Updates one or more fields of an existing product.
 * Restricted to users with the `admin` role.
 *
 * @type {import('express').RequestHandler}
 */
const updateProduct = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError('Admin role required', 403));
  }

  const product = store.products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  const { name, price, category, stock } = req.body;

  if (name && typeof name === 'string') {
    product.name = name;
  }

  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return next(new ApiError('Price must be a positive number', 400));
    }
    product.price = parsedPrice;
  }

  if (category && typeof category === 'string') {
    product.category = category;
  }

  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return next(new ApiError('Stock cannot be negative', 400));
    }
    product.stock = parsedStock;
  }

  product.updatedAt = new Date().toISOString();

  logEvent({
    type: 'products.update',
    summary: `Producto actualizado: ${product.name}`,
    details: { productId: product.id, updatedBy: req.user.email }
  });

  res.json({
    message: 'Product updated successfully',
    product
  });
};

/**
 * Permanently removes a product from the catalogue.
 * Restricted to users with the `admin` role.
 *
 * @type {import('express').RequestHandler}
 */
const deleteProduct = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError('Admin role required', 403));
  }

  const productIndex = store.products.findIndex((p) => p.id === Number(req.params.id));

  if (productIndex === -1) {
    return next(new ApiError('Product not found', 404));
  }

  const [deleted] = store.products.splice(productIndex, 1);

  logEvent({
    type: 'products.delete',
    summary: `Producto eliminado: ${deleted.name}`,
    details: { productId: deleted.id, deletedBy: req.user.email }
  });

  res.json({
    message: 'Product deleted successfully',
    product: deleted
  });
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
