import { body, param, validationResult } from 'express-validator';
import { handleValidationErrors } from '../utils/validationHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Validates user ID parameter
 */
export const validateUserId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid user ID')
    .toInt(),
  
  handleValidationErrors
];

/**
 * Validates user vote data
 */
export const validateUserVote = [
  // User ID validation
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
    .toInt(),
  
  // Candidate ID validation
  body('candidate_id')
    .notEmpty().withMessage('Candidate ID is required')
    .isInt({ min: 1 }).withMessage('Candidate ID must be a positive integer')
    .toInt(),
  
  // Apply validation
  handleValidationErrors
];

/**
 * Validate vote submission request data
 */
export const validateVoteRequest = [
  body('candidate_id')
    .notEmpty().withMessage('Candidate ID is required')
    .isInt({ min: 1 }).withMessage('Candidate ID must be a positive integer'),
  
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Vote validation failed: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }
    next();
  }
]; 