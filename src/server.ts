import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// 1. Initialize the App
const app = express();

// 2. Middleware Pipeline
app.use(cors());
app.use(express.json());

// 3. Database Connection Architecture
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Architect Check: Fail fast if the environment variable is missing
    if (!mongoURI) {
      throw new Error("FATAL ERROR: MONGODB_URI is missing in the .env file.");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Engine Online: Successfully connected to Atlas');

  } catch (error) {
    // TypeScript safety: Determine if the error is a standard Error object
    if (error instanceof Error) {
      console.error('❌ Database connection failed:', error.message);
    } else {
      console.error('❌ Database connection failed with an unknown error');
    }

    // Architect decision: Crash the process if the DB fails. A silent failure is a dead API.
    process.exit(1);
  }
};

// 4. Health Check Route
app.get('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'NexusHQ Backend Engine is online (TypeScript Edition).',
    timestamp: new Date().toISOString()
  });
});

// 5. Server Initialization
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

// Boot Sequence: Connect to the database FIRST, then open the port
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 NexusHQ TS API routing online. Listening on port ${PORT}...`);
  });
});