import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { sqlInjectionProtection, securityHeaders, rateLimit } from './middlewares/securityMiddleware.js';
import logger from './utils/logger.js';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(rateLimit);

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL injection protection (after body parsing)
app.use(sqlInjectionProtection);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Bicol Research Website API' });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app; 