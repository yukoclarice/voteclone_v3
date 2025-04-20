import { submitVote } from '../services/userService.js';
import { logger } from '../utils/logger.js';

/**
 * Submit a vote
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const vote = async (req, res) => {
  try {
    const voteData = {
      userId: req.body.user_id,
      candidateId: req.body.candidate_id
    };
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Validate required fields
    if (!voteData.userId || !voteData.candidateId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and candidate ID are required'
      });
    }
    
    const result = await submitVote(voteData, ipAddress);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Error in vote submission controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your vote'
    });
  }
}; 