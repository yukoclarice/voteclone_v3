import { validationResult } from 'express-validator';
import { logger } from './logger.js';

/**
 * Middleware to handle validation errors from express-validator
 * Returns a consistent error response format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} - Error response or continues to next middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    logger.warn(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

/**
 * Creates a validation chain with common settings
 * @param {Function} validator - Express-validator chain function
 * @param {string} field - Field to validate
 * @returns {Function} - Express-validator chain with common settings
 */
export const createValidator = (validator, field) => {
  return validator(field)
    .trim()
    .escape(); // Apply basic sanitization to all fields
}; 