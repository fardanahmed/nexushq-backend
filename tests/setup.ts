import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach } from 'vitest';

process.env.JWT_SECRET = 'test-secret';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  // Build unique indexes before tests rely on them
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
});

afterEach(async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
