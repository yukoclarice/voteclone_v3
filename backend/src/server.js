import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, testConnection } from './config/db.js';
// Import models to ensure associations are loaded
import './models/index.js';
import { logger, morganStream } from './utils/logger.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { sqlInjectionProtection, securityHeaders } from './middlewares/securityMiddleware.js';
import fs from 'fs';

// Import routes
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxies for proper IP detection
// This is important for getting the correct client IP when behind a proxy or load balancer
// In production, you might want to limit this to your proxy IPs only
app.set('trust proxy', true);
logger.info('Proxy trust enabled for IP detection');

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://voteclone-v3.vercel.app'] 
    : 'http://localhost:5173',
  credentials: true
}));

// Log environment variables for debugging
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);

// Request logging
app.use(morgan('combined', { stream: morganStream }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL injection protection (after body parsing)
app.use(sqlInjectionProtection);

// API routes
app.use('/api', routes);

// Base route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bicol Research Website API is running' });
});

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  try {
    // Frontend build path - relative to the backend directory
    const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
    
    // Check if the directory exists before configuring static serving
    if (fs.existsSync(frontendBuildPath)) {
      logger.info(`Serving static files from: ${frontendBuildPath}`);
      
      // Serve static files from the frontend build directory
      app.use(express.static(frontendBuildPath));
      
      // Handle any requests that don't match the API routes
      app.get('*', (req, res) => {
        // Check if index.html exists before sending it
        const indexPath = path.join(frontendBuildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          logger.error(`index.html not found at ${indexPath}`);
          res.status(404).json({ error: 'Frontend assets not found' });
        }
      });
    } else {
      logger.warn(`Frontend build directory not found at: ${frontendBuildPath}`);
      logger.warn('Static file serving disabled. API-only mode activated.');
    }
  } catch (error) {
    logger.error(`Error setting up static file serving: ${error.message}`);
    // Continue running the API even if static serving fails
  }
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    logger.info('Connected to database');
    
    // Sync database models (in development only)
    if (process.env.NODE_ENV === 'development' && process.env.SYNC_DB === 'true') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled promise rejection: ${err.message}`, err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

export default app; 
