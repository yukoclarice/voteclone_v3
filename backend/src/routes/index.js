import express from 'express';
import candidateRoutes from './candidateRoutes.js';
import { pool } from '../config/db.js';

const router = express.Router();

// Test route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ dbTest: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount candidate routes
router.use('/candidates', candidateRoutes);

export default router; 