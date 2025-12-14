import request from 'supertest';
import { createApp } from '../../core/app';

describe('core app', () => {
  const app = createApp();

  test('GET /health returns 200 and ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
