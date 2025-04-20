import express from 'express';
import { vote } from '../controllers/userController.js';
import { validateVoteRequest } from '../validators/userValidator.js';

const router = express.Router();

/**
 * @route   POST /api/users/vote
 * @desc    Submit a vote for a candidate
 * @access  Public
 */
router.post('/vote', validateVoteRequest, vote);

export default router; 