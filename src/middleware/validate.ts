import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

// Validates req.body against a zod schema and replaces it with the parsed value.
export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') });
    return;
  }
  req.body = result.data;
  next();
};
