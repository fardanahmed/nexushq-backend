import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';
import Feature from '../src/models/Feature.js';
import Setting from '../src/models/Setting.js';
import WaitlistEntry from '../src/models/WaitlistEntry.js';

describe('health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});

describe('features', () => {
  it('is empty before seeding', async () => {
    const res = await request(app).get('/api/features');
    expect(res.body).toEqual({ items: [] });
  });

  it('returns the frontend Feature shape when seeded', async () => {
    await Feature.create({ title: 'Smart Scheduling', description: 'd', icon: 'Calendar' });
    const res = await request(app).get('/api/features');
    expect(res.body.items).toHaveLength(1);
    const item = res.body.items[0];
    expect(Object.keys(item).sort()).toEqual(['created_at', 'description', 'icon', 'id', 'title']);
  });
});

describe('settings', () => {
  it('returns 200 with the value', async () => {
    await Setting.create({ key: 'mentorship_content', value: { title: 'T' } });
    const res = await request(app).get('/api/settings/mentorship_content');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ value: { title: 'T' } });
  });

  it('returns 404 when missing', async () => {
    const res = await request(app).get('/api/settings/nope');
    expect(res.status).toBe(404);
  });
});

describe('contact', () => {
  it('rejects invalid input with 400', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'A', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('stores a valid message and returns 201', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'A', email: 'a@example.com', subject: 'Hi', message: 'Hello' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBeTruthy();
  });
});

describe('waitlist', () => {
  it('returns 201 for a duplicate email and stores it once', async () => {
    const first = await request(app).post('/api/waitlist').send({ email: 'W@example.com' });
    const second = await request(app).post('/api/waitlist').send({ email: 'w@example.com' });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(await WaitlistEntry.countDocuments()).toBe(1);
  });
});

describe('auth', () => {
  const creds = { email: 'u@example.com', password: 'secret123' };

  it('registers, logs in and returns the user on /me', async () => {
    const reg = await request(app).post('/api/auth/register').send(creds);
    expect(reg.status).toBe(201);
    const login = await request(app).post('/api/auth/login').send(creds);
    expect(login.status).toBe(200);
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(creds.email);
    expect(me.body.id).toBeTruthy();
  });

  it('rejects a wrong password with 401', async () => {
    await request(app).post('/api/auth/register').send(creds);
    const res = await request(app).post('/api/auth/login').send({ ...creds, password: 'wrong-pass' });
    expect(res.status).toBe(401);
  });

  it('rejects /me without a token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
