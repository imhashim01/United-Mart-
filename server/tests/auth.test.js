import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Authentication API', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  it('registers a new customer account', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Ayesha Khan',
        email: 'ayesha@example.com',
        password: 'P@ssw0rd123',
        role: 'customer',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('ayesha@example.com');
    expect(response.body.user.role).toBe('customer');
  });

  it('logs in an existing user and returns a token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'ayesha@example.com',
        password: 'P@ssw0rd123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('ayesha@example.com');
  });
});
