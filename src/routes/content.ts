import { Router } from 'express';
import Feature from '../models/Feature.js';
import Setting from '../models/Setting.js';

const router = Router();

router.get('/features', async (_req, res) => {
  const items = await Feature.find().sort({ order: 1, created_at: 1 });
  res.json({ items });
});

router.get('/settings/:key', async (req, res) => {
  const setting = await Setting.findOne({ key: req.params.key });
  if (!setting) {
    res.status(404).json({ message: 'Setting not found' });
    return;
  }
  res.json({ value: setting.value });
});

export default router;
