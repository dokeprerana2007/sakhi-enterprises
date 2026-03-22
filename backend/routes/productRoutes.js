import express from 'express';
import Product from '../models/Product.js';
import { addClient } from '../utils/sse.js';

const router = express.Router();

// Public products API
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server-Sent Events stream for real-time product updates
router.get('/api/products/stream', (req, res) => {
  addClient(res);
});

router.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server-Sent Events endpoint for live product updates
// (stream route above)

export default router;
