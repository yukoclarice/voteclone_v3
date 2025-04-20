import { logger } from '../utils/logger.js';

/**
 * Middleware to detect and prevent potential SQL injection attempts
 * This is an additional layer beyond express-validator and Sequelize
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const sqlInjectionProtection = (req, res, next) => {
  // SQL injection patterns to check for
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\s/i,
    /(\s|^)(UNION|JOIN|INTO|WHERE)\s/i,
    /--/,        // SQL comment
    /\/\*/,      // Block comment start
    /;\s*$/,     // Query terminator
    /'\s*OR\s/i, // OR condition often used in injection
    /'\s*AND\s/i // AND condition often used in injection
  ];
  
  // Check request parameters
  const checkParams = (obj) => {
    if (!obj) return false;
    
    return Object.values(obj).some(value => {
      if (typeof value === 'string') {
        return sqlPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return checkParams(value);
      }
      return false;
    });
  };
  
  const hasSuspiciousParams = checkParams(req.query) || checkParams(req.body) || checkParams(req.params);
  
  if (hasSuspiciousParams) {
    logger.warn(`Potential SQL injection attempt detected: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    return res.status(403).json({
      status: 'error',
      message: 'Invalid input detected'
    });
  }
  
  next();
};

/**
 * Middleware to add security headers to responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const securityHeaders = (req, res, next) => {
  // Common security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

/**
 * Rate limiting protection (simple implementation)
 * For production, consider using a more robust solution like express-rate-limit
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // Adjust as needed

export const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    const client = requestCounts.get(clientIP);
    
    if (now > client.resetTime) {
      // Reset window
      client.count = 1;
      client.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      // Increment request count
      client.count += 1;
      
      // Check if rate limit exceeded
      if (client.count > MAX_REQUESTS_PER_WINDOW) {
        logger.warn(`Rate limit exceeded for IP: ${clientIP}`);
        return res.status(429).json({
          status: 'error',
          message: 'Too many requests, please try again later'
        });
      }
    }
  }
  
  next();
}; 