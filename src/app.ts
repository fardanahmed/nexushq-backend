import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import content from './routes/content.js';
import contact from './routes/contact.js';
import waitlist from './routes/waitlist.js';
import auth from './routes/auth.js';
import { notFound, errorHandler } from './middleware/errors.js';

export const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:4321').split(',').map((o) => o.trim());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'NexusHQ Backend Engine is online (TypeScript Edition).',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', content);
app.use('/api/contact', limiter, contact);
app.use('/api/waitlist', limiter, waitlist);
app.use('/api/auth', limiter, auth);

app.use(notFound);
app.use(errorHandler);
