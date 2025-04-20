// Candidate validation middleware

import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../utils/validationHandler.js';
import Candidate from '../models/Candidate.js';
import { logger } from '../utils/logger.js';

/**
 * Validates candidate creation and update requests
 * Complements Sequelize model validation by validating at the request level
 */
export const validateCandidateData = [
  // Name validation
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
    .trim()
    .escape(),
  
  // Position ID validation
  body('position_id')
    .notEmpty().withMessage('Position ID is required')
    .isInt({ min: 1 }).withMessage('Position ID must be a positive integer')
    .toInt(),
  
  // Ballot number validation
  body('ballot_no')
    .notEmpty().withMessage('Ballot number is required')
    .isInt({ min: 1 }).withMessage('Ballot number must be a positive integer')
    .toInt(),
  
  // Party validation (optional)
  body('party')
    .optional()
    .isLength({ max: 100 }).withMessage('Party must be 100 characters or less')
    .trim()
    .escape(),
  
  // Party code validation (optional)
  body('party_code')
    .optional()
    .isLength({ max: 50 }).withMessage('Party code must be 50 characters or less')
    .trim()
    .escape(),
  
  // Province code validation (optional)
  body('province_code')
    .optional()
    .isLength({ max: 9 }).withMessage('Province code must be 9 characters or less')
    .trim()
    .escape(),
  
  // District validation (optional)
  body('district')
    .optional()
    .isInt({ min: 1 }).withMessage('District must be a positive integer')
    .toInt(),
  
  // Municipality code validation (optional)
  body('municipality_code')
    .optional()
    .isLength({ max: 9 }).withMessage('Municipality code must be 9 characters or less')
    .trim()
    .escape(),
  
  // Picture validation
  body('picture')
    .notEmpty().withMessage('Picture is required')
    .isLength({ max: 255 }).withMessage('Picture URL must be 255 characters or less')
    .trim(),
  
  // Votes validation (optional for admin updates)
  body('votes')
    .optional()
    .isInt({ min: 0 }).withMessage('Votes must be a non-negative integer')
    .toInt(),
  
  // Total votes validation (optional for admin updates)
  body('total_votes')
    .optional()
    .isInt({ min: 0 }).withMessage('Total votes must be a non-negative integer')
    .toInt(),
  
  // Vote percentage validation (optional for admin updates)
  body('vote_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Vote percentage must be between 0 and 100')
    .toFloat(),
  
  // Apply the validation
  handleValidationErrors
];

/**
 * Validates candidate ID parameter
 */
export const validateCandidateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid candidate ID')
    .toInt(),
  
  handleValidationErrors
];

/**
 * Validates query parameters for candidate listing
 */
export const validateCandidateQuery = [
  query('province_code')
    .optional()
    .isLength({ min: 1, max: 9 }).withMessage('Province code must be between 1 and 9 characters')
    .trim()
    .escape(),
  
  query('position_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Position ID must be a positive integer')
    .toInt(),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters')
    .trim()
    .escape(),
  
  handleValidationErrors
]; 