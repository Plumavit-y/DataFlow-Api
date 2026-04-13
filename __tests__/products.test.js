const request = require('supertest');
const app = require('../src/app');
const { resetStore } = require('../src/data/store');

describe('Product endpoints', () => {
  beforeEach(() => {
    resetStore();
  });

  it('lists products without authentication', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(3);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('allows admin to create a product', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@portfolio.dev',
      password: 'Admin123!',
    });

    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;

    const newProduct = {
      name: 'Portfolio Mug',
      price: 15.5,
      category: 'Merch',
      stock: 40,
    };

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toMatchObject({
      name: 'Portfolio Mug',
      category: 'Merch',
    });
  });
});
