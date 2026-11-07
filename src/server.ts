import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Fail fast if required environment variables are missing
    if (!mongoURI) {
      throw new Error('FATAL ERROR: MONGODB_URI is missing in the .env file.');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('FATAL ERROR: JWT_SECRET is missing in the .env file.');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : error);
    // A silent failure is a dead API: crash if the DB (or config) is bad.
    process.exit(1);
  }
};

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

// Boot Sequence: Connect to the database FIRST, then open the port
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`NexusHQ API listening on port ${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down');
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  });
});
