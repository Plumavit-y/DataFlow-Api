const request = require('supertest');
const app = require('../src/app');
const { resetStore } = require('../src/data/store');

describe('Auth endpoints', () => {
  beforeEach(() => {
    resetStore();
  });

  it('registers a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'dev@portfolio.test',
      password: 'StrongPass1',
      name: 'Dev Tester',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toMatchObject({
      email: 'dev@portfolio.test',
      name: 'Dev Tester',
    });
    expect(typeof res.body.token).toBe('string');
  });

  it('allows login and retrieves profile data', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'profile@portfolio.test',
      password: 'StrongPass1',
      name: 'Profile Tester',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'profile@portfolio.test',
      password: 'StrongPass1',
    });

    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    expect(typeof token).toBe('string');

    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body).toMatchObject({
      email: 'profile@portfolio.test',
      name: 'Profile Tester',
    });
  });
});
