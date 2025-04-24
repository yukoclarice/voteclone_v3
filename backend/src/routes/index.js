import express from 'express';
import candidateRoutes from './candidateRoutes.js';
import statusRoutes from './statusRoutes.js';
import userRoutes from './userRoutes.js';
import { sequelize } from '../config/db.js';
import { Province } from '../models/index.js';
import { apiKeyAuth } from '../middlewares/apiKeyMiddleware.js';

const router = express.Router();

// Test route - publicly accessible for health checks
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Health check route - publicly accessible
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bicol Research Website API is running' });
});

// Debug endpoint to check headers - publicly accessible but only in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug-headers', (req, res) => {
    // Remove sensitive information
    const safeHeaders = { ...req.headers };
    delete safeHeaders.authorization;
    
    res.json({ 
      message: 'Debug info - DO NOT USE IN PRODUCTION',
      headers: safeHeaders,
      ip: req.ip,
      forwarded: req.headers['x-forwarded-for'],
      apiKeyPresent: !!req.header('X-API-Key'),
      expectedApiKey: process.env.API_KEY?.substring(0, 3) + '...' + process.env.API_KEY?.substring(process.env.API_KEY.length - 3)
    });
  });
}

// All other routes require API key authentication
router.use(apiKeyAuth);

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