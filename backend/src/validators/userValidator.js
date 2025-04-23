import { body, param } from 'express-validator';
import { handleValidationErrors } from '../utils/validationHandler.js';

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
 * Validate vote submission request data
 * Used for validating vote submissions with the new data structure
 */
export const validateVoteRequest = [
  // Validate userInfo object
  body('userInfo').notEmpty().withMessage('User information is required'),
  
  body('userInfo.firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 255 }).withMessage('First name must be between 2 and 255 characters'),
  
  body('userInfo.lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Last name must be between 2 and 255 characters'),
  
  body('userInfo.mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^0[0-9]{10}$/).withMessage('Mobile number must be 11 digits starting with 0'),
  
  body('userInfo.age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 18 }).withMessage('Age must be at least 18 years')
    .toInt(),
  
  body('userInfo.sex')
    .notEmpty().withMessage('Sex is required')
    .isIn(['M', 'F', 'male', 'female']).withMessage('Sex must be "M", "F", "male", or "female"'),
  
  body('userInfo.email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  // Validate votes object
  body('votes').notEmpty().withMessage('Votes are required'),
  
  // All vote types are optional individually, but at least one should be provided
  body('votes.senators')
    .optional()
    .isArray().withMessage('Senators must be an array')
    .custom((value, { req }) => {
      if (value && value.length > 12) {
        throw new Error('You can select a maximum of 12 senators');
      }
      return true;
    }),
  
  body('votes.senators.*')
    .optional()
    .isInt({ min: 1 }).withMessage('Senator ID must be a positive integer')
    .toInt(),
  
  body('votes.partyList')
    .optional()
    .isInt({ min: 1 }).withMessage('Party list ID must be a positive integer')
    .toInt(),
  
  body('votes.governor')
    .optional()
    .isInt({ min: 1 }).withMessage('Governor ID must be a positive integer')
    .toInt(),
  
  // Ensure at least one vote type is provided
  body('votes').custom((votes) => {
    if (!votes.senators?.length && !votes.partyList && !votes.governor) {
      throw new Error('At least one vote (senator, party list, or governor) is required');
    }
    return true;
  }),
  
  handleValidationErrors
]; 