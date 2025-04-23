import express from 'express';
import { Total } from '../models/index.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /api/status/voting
 * @desc    Get the current voting status (open or closed)
 * @access  Public
 */
router.get('/voting', async (req, res) => {
  try {
    // Find the voting status record (id = 1)
    const votingStatus = await Total.findByPk(1, {
      attributes: ['is_closed', 'updatedAt']
    });

    if (!votingStatus) {
      return res.status(404).json({ 
        success: false, 
        message: 'Voting status record not found' 
      });
    }

    logger.info(`Voting status checked: is_closed=${votingStatus.is_closed}`);
    
    return res.status(200).json({
      success: true,
      data: {
        isVotingOpen: votingStatus.is_closed === true, // 1 means open, 0 means closed
        lastUpdated: votingStatus.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error getting voting status:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving voting status',
      error: error.message 
    });
  }
});

export default router; 