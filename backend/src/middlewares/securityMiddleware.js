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
  // Updated CSP to allow inline styles and scripts needed for React
  res.setHeader(
    'Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  );
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
}; 