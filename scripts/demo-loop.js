const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_CREDENTIALS = { email: 'admin@portfolio.dev', password: 'Admin123!' };
const DEMO_USER = { email: 'demo-loop@portfolio.dev', password: 'DemoPass1', name: 'Demo Bot' };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => 1200 + Math.random() * 1800;
const log = (message) => console.log(`[demo-loop] ${message}`);

const handleRequestError = async (error, context) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 429) {
      const retryAfterHeader = error.response.headers['retry-after'];
      const baseDelay = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 5000;
      // Cap at 10s to evitar esperas muy largas
      const retryAfter = Math.min(baseDelay, 10000);
      log(`Rate limited durante ${context}. Esperando ${retryAfter}ms.`);
      await sleep(retryAfter);
      return;
    }
    log(`Error ${status} en ${context}: ${error.response.data?.error || error.message}`);
    await sleep(1000);
    return;
  }
  log(`Error de red en ${context}: ${error.message}`);
  await sleep(1000);
};

const registerDemoUser = async () => {
  try {
    await axios.post(
      `${API_URL}/api/auth/register`,
      DEMO_USER,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    log('Usuario demo registrado correctamente');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      log('El usuario demo ya existe');
      return;
    }
    await handleRequestError(error, 'registro del usuario demo');
    await registerDemoUser();
  }
};

const logUserIn = async () => {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
    { email: DEMO_USER.email, password: DEMO_USER.password },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return response.data.token;
};

const ensureTokens = async () => {
  while (true) {
    try {
      const adminLogin = await axios.post(`${API_URL}/api/auth/login`, ADMIN_CREDENTIALS, {
        headers: { 'Content-Type': 'application/json' }
      });

      await registerDemoUser();
      const userToken = await logUserIn();

      return {
        adminToken: adminLogin.data.token,
        userToken
      };
    } catch (error) {
      await handleRequestError(error, 'obtención de tokens');
    }
  }
};

const listPublicProducts = async () => {
  const response = await axios.get(`${API_URL}/api/products`);
  log(`Productos listados (${response.data.count})`);
  return response.data.products;
};

const createOrder = async (userToken) => {
  const products = await listPublicProducts();
  const target = products.find((product) => product.stock > 0) || products[0];
  if (!target) {
    log('No hay productos para ordenar');
    return;
  }

  await axios.post(
    `${API_URL}/api/orders`,
    { items: [{ productId: target.id, quantity: 1 }] },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      }
    }
  );

  log(`Orden creada para ${target.name}`);
};

const listOrders = async (userToken) => {
  const response = await axios.get(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  log(`Se consultaron ${response.data.count} órdenes`);
};

const viewStats = async (userToken) => {
  const response = await axios.get(`${API_URL}/api/stats`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  log(`Stats: ${response.data.totalOrders} órdenes, gasto ${response.data.totalSpent}`);
};

const healthCheck = async () => {
  await axios.get(`${API_URL}/api/health`);
  log('Chequeo de salud completado');
};

let productCreationCount = 0;

const createProduct = async (adminToken) => {
  if (productCreationCount >= 3 || Math.random() > 0.3) {
    log('Saltar creación de producto para evitar saturar');
    return;
  }

  const name = `Live Demo ${Date.now().toString(36)}`;
  await axios.post(
    `${API_URL}/api/products`,
    {
      name,
      price: Number((10 + Math.random() * 40).toFixed(2)),
      category: 'Demo',
      stock: 20
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      }
    }
  );

  productCreationCount += 1;
  log(`Producto demo creado (${name})`);
};

const startLoop = async () => {
  try {
    const { adminToken, userToken } = await ensureTokens();

    const actions = [
      () => listPublicProducts(),
      () => createOrder(userToken),
      () => listOrders(userToken),
      () => viewStats(userToken),
      () => healthCheck(),
      () => createProduct(adminToken)
    ];

    log('Demo loop iniciado');
    while (true) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      try {
        await action();
      } catch (error) {
        await handleRequestError(error, 'action loop');
      }

      await sleep(randomDelay());
    }
  } catch (error) {
    log(`No se pudieron obtener tokens: ${error.message}`);
    process.exit(1);
  }
};

startLoop();
