import { Candidate, UserVote, User, Total } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { sequelize } from '../config/db.js';
import { Sequelize, Op } from 'sequelize';

/**
 * Check if a user has already voted based on email, mobile, name, or IP address
 * @param {Object} userInfo - User information from the form
 * @param {String} ipAddress - IP address of the user
 * @returns {Object} - Result with success flag and message
 */
export const checkDuplicateVoter = async (userInfo, ipAddress) => {
  try {
    // Check duplicate email
    const duplicateEmailUser = await User.findOne({
      where: { email: userInfo.email }
    });
    
    if (duplicateEmailUser) {
      // Check if this user has any votes in the UserVote table
      const userVotes = await UserVote.findOne({
        where: { user_id: duplicateEmailUser.id }
      });
      
      if (userVotes) {
        logger.warn(`Duplicate vote attempt with email: ${userInfo.email}`);
        return {
          success: false,
          message: 'You already voted'
        };
      }
    }
    
    // Check duplicate mobile number
    const duplicateMobileUser = await User.findOne({
      where: { mobileNumber: userInfo.mobileNumber }
    });
    
    if (duplicateMobileUser) {
      // Check if this user has any votes in the UserVote table
      const userVotes = await UserVote.findOne({
        where: { user_id: duplicateMobileUser.id }
      });
      
      if (userVotes) {
        logger.warn(`Duplicate vote attempt with mobile number: ${userInfo.mobileNumber}`);
        return {
          success: false,
          message: 'You already voted'
        };
      }
    }
    
    // Check duplicate full name
    const duplicateNameUser = await User.findOne({
      where: { 
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
      }
    });
    
    if (duplicateNameUser) {
      // Check if this user has any votes in the UserVote table
      const userVotes = await UserVote.findOne({
        where: { user_id: duplicateNameUser.id }
      });
      
      if (userVotes) {
        logger.warn(`Duplicate vote attempt with name: ${userInfo.firstName} ${userInfo.lastName}`);
        return {
          success: false,
          message: 'You already voted'
        };
      }
    }
    
    // Check votes from same IP address
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get users with this IP address
    const usersWithIp = await User.findAll({
      where: { ipAddress: ipAddress }
    });
    
    if (usersWithIp.length > 0) {
      // Get the user IDs from the IP
      const userIds = usersWithIp.map(user => user.id);
      
      // Count unique users with votes from this IP today
      const votesToday = await UserVote.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('user_id')), 'user_id']
        ],
        where: {
          user_id: { [Op.in]: userIds },
          voted_at: { [Op.gte]: today }
        }
      });
      
      if (votesToday.length >= 3) {
        logger.warn(`More than 3 votes today from IP: ${ipAddress}`);
        return {
          success: false,
          message: 'You already voted'
        };
      }
    }
    
    return {
      success: true
    };
  } catch (error) {
    logger.error(`Error checking duplicate voter: ${error.message}`);
    throw new Error('Failed to check duplicate voter');
  }
};

/**
 * Submit votes for multiple candidates
 * @param {Object} userInfo - User information for registration
 * @param {Object} votes - Object containing arrays of candidate IDs
 * @param {String} ipAddress - IP address of the user
 * @returns {Object} - Vote submission result with status and message
 */
export const submitVote = async (userInfo, votes, ipAddress) => {
  const transaction = await sequelize.transaction();
  
  try {
    logger.info(`Processing vote submission for ${userInfo.email}`);
    
    // Ensure votes object exists
    votes = votes || {};
    
    // Convert sex values from 'M'/'F' to 'male'/'female'
    if (userInfo.sex) {
      if (userInfo.sex === 'M') {
        userInfo.sex = 'male';
      } else if (userInfo.sex === 'F') {
        userInfo.sex = 'female';
      }
      // If it's already 'male' or 'female', keep it as is
      logger.info(`Sex value normalized to: ${userInfo.sex}`);
    }
    
    // Create or update user
    let user = await User.findOne({ 
      where: { email: userInfo.email }, 
      transaction 
    });
    
    if (!user) {
      // Create new user
      user = await User.create({
        ...userInfo,
        ipAddress
      }, { transaction });
      
      logger.info(`New user created: ${user.id}`);
    } else {
      // Check if user has already voted
      const existingVote = await UserVote.findOne({
        where: { user_id: user.id },
        transaction
      });
      
      if (existingVote) {
        await transaction.rollback();
        return {
          success: false,
          message: 'You already voted'
        };
      }
    }
    
    // Variable to track if at least one vote was cast
    let voteCast = false;
    
    // Process senators
    if (votes.senators && Array.isArray(votes.senators) && votes.senators.length > 0) {
      logger.info(`Processing ${votes.senators.length} senator votes`);
      
      for (const senatorId of votes.senators) {
        const senator = await Candidate.findByPk(senatorId, { transaction });
        
        if (!senator) {
          logger.warn(`Invalid senator ID: ${senatorId}`);
          await transaction.rollback();
          return {
            success: false,
            message: 'Invalid senator candidate selected'
          };
        }
        
        // Increment vote count
        await senator.increment('votes', { by: 1, transaction });
        
        // Record vote in UserVote table
        await UserVote.create({
          user_id: user.id,
          candidate_id: senatorId,
          voted_at: new Date()
        }, { transaction });
        
        voteCast = true;
      }
    }
    
    // Process party list
    if (votes.partyList) {
      logger.info(`Processing party list vote: ${votes.partyList}`);
      
      const partyList = await Candidate.findByPk(votes.partyList, { transaction });
      
      if (!partyList) {
        logger.warn(`Invalid party list ID: ${votes.partyList}`);
        await transaction.rollback();
        return {
          success: false,
          message: 'Invalid party list selected'
        };
      }
      
      // Increment vote count
      await partyList.increment('votes', { by: 1, transaction });
      
      // Record vote in UserVote table
      await UserVote.create({
        user_id: user.id,
        candidate_id: votes.partyList,
        voted_at: new Date()
      }, { transaction });
      
      voteCast = true;
    }
    
    // Process governor
    if (votes.governor) {
      logger.info(`Processing governor vote: ${votes.governor}`);
      
      const governor = await Candidate.findByPk(votes.governor, { transaction });
      
      if (!governor) {
        logger.warn(`Invalid governor ID: ${votes.governor}`);
        await transaction.rollback();
        return {
          success: false,
          message: 'Invalid governor selected'
        };
      }
      
      // Increment vote count
      await governor.increment('votes', { by: 1, transaction });
      
      // Record vote in UserVote table
      await UserVote.create({
        user_id: user.id,
        candidate_id: votes.governor,
        voted_at: new Date()
      }, { transaction });
      
      voteCast = true;
    }
    
    // Check if at least one vote was cast
    if (!voteCast) {
      logger.warn('No votes were cast');
      await transaction.rollback();
      return {
        success: false,
        message: 'At least one vote is required'
      };
    }
    
    // Update totals table
    const total = await Total.findOne({ 
      order: [['createdAt', 'DESC']], 
      transaction 
    });
    
    if (total) {
      await total.increment('total_voters', { by: 1, transaction });
    }
    
    await transaction.commit();
    logger.info(`Vote submission successful for user ${user.id}`);
    
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