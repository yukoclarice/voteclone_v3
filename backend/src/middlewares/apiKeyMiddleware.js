import { logger } from '../utils/logger.js';

/**
 * Middleware to validate API key in requests
 * Checks for valid API key in request headers
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  // Get the expected API key from environment variables
  const validApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    logger.warn(`Invalid API key attempt: ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    });
  }
  
  // API key is valid, proceed to the next middleware/controller
  next();
}; 