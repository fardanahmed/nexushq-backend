import { Router } from 'express';
import { z } from 'zod';
import WaitlistEntry from '../models/WaitlistEntry.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const schema = z.object({ email: z.email() });

// Same 201 response whether or not the email was already on the list.
router.post('/', validate(schema), async (req, res) => {
  try {
    await WaitlistEntry.create({ email: req.body.email });
  } catch (err) {
    if (!(err instanceof Error && 'code' in err && err.code === 11000)) throw err;
  }
  res.status(201).json({ message: "You're on the list!" });
});

export default router;
