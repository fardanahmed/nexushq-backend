import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  try {
    if (!header?.startsWith('Bearer ')) throw new Error('missing token');
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET as string) as { id: string };
    res.locals.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
