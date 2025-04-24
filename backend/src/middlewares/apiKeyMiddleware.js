import { logger } from '../utils/logger.js';

/**
 * Middleware to validate API key in requests
 * Checks for valid API key in request headers
 */
export const apiKeyAuth = (req, res, next) => {
  // Skip API key validation for OPTIONS requests (preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  const apiKey = req.header('X-API-Key');
  
  // Get the expected API key from environment variables
  const validApiKey = process.env.API_KEY;
  
  // Debug logging - only in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`API Key received: ${apiKey ? '✓' : '✗'}`);
    logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    logger.warn(`Invalid API key attempt from ${ipAddress} for ${req.method} ${req.originalUrl}. Key provided: ${apiKey || 'none'}`);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    });
  }
  
  // API key is valid, proceed to the next middleware/controller
  next();
}; 