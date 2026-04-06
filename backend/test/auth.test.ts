import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/server';
import { User } from '../src/models/User';

describe('Auth & Users API', () => {
  beforeAll(async () => {
    // Just in case it's not connected, wait for connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/smart-insight-hub-test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should list users with pagination', async () => {
    const res = await request(app).get('/api/auth/users?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    // Since demo users are seeded, we expect at least an array format
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
