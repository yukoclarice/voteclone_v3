import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, testConnection } from './config/db.js';
// Import models to ensure associations are loaded
import './models/index.js';
import { logger, morganStream } from './utils/logger.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { sqlInjectionProtection, securityHeaders } from './middlewares/securityMiddleware.js';

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
app.use(cors());

// Log environment variables for debugging
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`DISABLE_RATE_LIMIT: ${process.env.DISABLE_RATE_LIMIT}`);

// // Rate limiting middleware - ONLY for production
// if (process.env.NODE_ENV !== 'development') {
//   const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: 'Too many requests from this IP, please try again after a moment'
//   });
  
//   // Apply rate limiting to all API routes in production only
//   app.use('/api', apiLimiter);
//   logger.info('Rate limiting enabled for production');
// } else {
//   logger.info('Rate limiting disabled for development');
// }

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
app.get('/', (req, res) => {
  res.json({ message: 'Bicol Research Website API' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Get the directory name using ES module approach
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  // Handle any requests that don't match the above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
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