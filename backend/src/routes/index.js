import express from 'express';
import candidateRoutes from './candidateRoutes.js';
import statusRoutes from './statusRoutes.js';
import userRoutes from './userRoutes.js';
import { sequelize } from '../config/db.js';
import { Province } from '../models/index.js';

const router = express.Router();

// Test route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    res.json({ dbTest: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all provinces route
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await Province.findAll({
      attributes: ['code', 'name', 'region_code'],
      order: [['name', 'ASC']]
    });
    
    res.json({ 
      success: true, 
      count: provinces.length,
      data: provinces 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching provinces',
      error: err.message 
    });
  }
});

// Mount candidate routes
router.use('/candidates', candidateRoutes);

// Mount status routes
router.use('/status', statusRoutes);

// Mount user routes
router.use('/users', userRoutes);

export default router; 