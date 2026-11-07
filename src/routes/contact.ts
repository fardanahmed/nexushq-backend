import { Router } from 'express';
import { z } from 'zod';
import ContactMessage from '../models/ContactMessage.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000)
});

router.post('/', validate(schema), async (req, res) => {
  await ContactMessage.create(req.body);
  res.status(201).json({ message: 'Thanks, your message has been sent.' });
});

export default router;
