import type { Request, Response, NextFunction } from 'express';

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not found' });
};

// Central error handler: log server-side, never leak stack traces to the client.
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err);
  const status = typeof err === 'object' && err && 'status' in err && typeof err.status === 'number' ? err.status : 500;
  res.status(status).json({ message: status === 500 ? 'Internal server error' : 'Bad request' });
};
