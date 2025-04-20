import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import { logger } from '../utils/logger.js';
import { sequelize } from '../config/db.js';

/**
 * Submit a vote
 * @param {Object} voteData - Vote data including userId and candidateId
 * @param {String} ipAddress - IP address of the user
 * @returns {Object} - Vote submission result with status and message
 */
export const submitVote = async (voteData, ipAddress) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Check if the user exists
    const user = await User.findByPk(voteData.userId, { transaction });
    
    if (!user) {
      await transaction.rollback();
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    // Check if the user has already voted (based on hasVoted flag)
    if (user.hasVoted) {
      await transaction.rollback();
      return {
        success: false,
        message: 'You have already submitted a vote'
      };
    }
    
    // Update candidate's vote count
    const candidate = await Candidate.findByPk(voteData.candidateId, { transaction });
    
    if (!candidate) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Invalid candidate selected'
      };
    }
    
    await candidate.increment('votes', { by: 1, transaction });
    
    // Mark user as having voted
    await user.update({ 
      hasVoted: true,
      voteTimestamp: new Date()
    }, { transaction });
    
    await transaction.commit();
    
    return {
      success: true,
      message: 'Your vote has been recorded successfully'
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error submitting vote: ${error.message}`);
    throw new Error('Failed to submit vote');
  }
};

/**
 * Get voting statistics
 * @returns {Object} - Voting statistics grouped by position
 */
export const getCandidateStatistics = async () => {
  try {
    // Get stats grouped by position
    const stats = await sequelize.query(
      `SELECT 
         p.name as position_name,
         COUNT(c.id) as candidate_count,
         SUM(c.votes) as total_votes
       FROM tbl_candidates c
       JOIN tbl_positions p ON c.position_id = p.id
       GROUP BY p.id, p.name
       ORDER BY p.id`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    return stats;
  } catch (error) {
    logger.error(`Error getting statistics: ${error.message}`);
    throw new Error('Failed to get voting statistics');
  }
}; 