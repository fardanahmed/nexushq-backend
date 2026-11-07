import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

const schema = z.object({ email: z.email(), password: z.string().min(6).max(200) });

const sign = (id: string): string => jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

router.post('/register', validate(schema), async (req, res) => {
  if (await User.exists({ email: req.body.email.toLowerCase() })) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }
  const user = await User.create(req.body);
  res.status(201).json({ token: sign(user.id) });
});

router.post('/login', validate(schema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  res.json({ token: sign(user.id) });
});

router.get('/me', authenticate, async (_req, res) => {
  const user = await User.findById(res.locals.userId);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.json({ id: user.id, email: user.email });
});

export default router;
