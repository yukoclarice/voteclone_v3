import { Candidate, Position, Province } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';

// Services encapsulate business logic and can handle things like:
// - Data validation (beyond simple field validation)
// - Coordinating between multiple models
// - Handling business rules
// - Implementing complex operations

/**
 * Get all candidates with optional filtering
 * @param {Object} filters - Query filters like province_code, position_id, etc.
 * @returns {Promise<Array>} - List of candidates
 */
export const getCandidates = async (filters = {}) => {
  try {
    logger.info('Fetching all candidates');
    
    // Build query conditions based on filters
    const whereClause = {};
    const includeClause = [
      {
        model: Position,
        as: 'position',
        attributes: ['id', 'name']
      },
      {
        model: Province,
        as: 'province',
        attributes: ['code', 'name', 'region_code', 'island_group_code']
      }
    ];
    
    if (filters.province_code) {
      whereClause.province_code = filters.province_code;
    }
    
    if (filters.position_id) {
      whereClause.position_id = filters.position_id;
    }
    
    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { party: { [Op.like]: `%${filters.search}%` } }
      ];
    }
    
    // Use Sequelize's findAll with secure query options
    const candidates = await Candidate.findAll({
      where: whereClause,
      include: includeClause,
      order: [
        ['position_id', 'ASC'],
        ['ballot_no', 'ASC']
      ]
    });
    
    return candidates;
  } catch (error) {
    logger.error('Error fetching candidates', error);
    throw error;
  }
};

/**
 * Get a candidate by ID
 * @param {number} id - Candidate ID
 * @returns {Promise<Object>} - Candidate details
 */
export const getCandidateDetails = async (id) => {
  try {
    logger.info(`Fetching candidate with ID: ${id}`);
    
    // findByPk is safer than findOne with where clause for ID lookups
    const candidate = await Candidate.findByPk(id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code', 'island_group_code']
        }
      ]
    });
    
    return candidate;
  } catch (error) {
    logger.error(`Error fetching candidate with ID: ${id}`, error);
    throw error;
  }
};

/**
 * Create a new candidate
 * @param {Object} candidateData - Candidate information
 * @returns {Promise<Object>} - Created candidate
 */
export const createNewCandidate = async (candidateData) => {
  try {
    logger.info('Creating new candidate');
    
    // Sequelize create automatically handles SQL injection protection
    const candidate = await Candidate.create(candidateData);
    
    // Reload the candidate with associations
    const reloadedCandidate = await Candidate.findByPk(candidate.id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code', 'island_group_code']
        }
      ]
    });
    
    return reloadedCandidate;
  } catch (error) {
    logger.error('Error creating candidate', error);
    throw error;
  }
};

/**
 * Update an existing candidate
 * @param {number} id - Candidate ID
 * @param {Object} candidateData - Updated candidate information
 * @returns {Promise<Object>} - Updated candidate
 */
export const updateExistingCandidate = async (id, candidateData) => {
  try {
    logger.info(`Updating candidate with ID: ${id}`);
    
    // First find the candidate
    const candidate = await Candidate.findByPk(id);
    
    if (!candidate) {
      return null;
    }
    
    // Update using the instance to trigger hooks and validations
    await candidate.update(candidateData);
    
    // Reload to get the latest data with associations
    const updatedCandidate = await Candidate.findByPk(id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code', 'island_group_code']
        }
      ]
    });
    
    return updatedCandidate;
  } catch (error) {
    logger.error(`Error updating candidate with ID: ${id}`, error);
    throw error;
  }
};

/**
 * Delete a candidate
 * @param {number} id - Candidate ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const removeCandidate = async (id) => {
  try {
    logger.info(`Deleting candidate with ID: ${id}`);
    
    // Find the candidate first to ensure it exists
    const candidate = await Candidate.findByPk(id);
    
    if (!candidate) {
      return false;
    }
    
    // Delete the candidate
    await candidate.destroy();
    
    return true;
  } catch (error) {
    logger.error(`Error deleting candidate with ID: ${id}`, error);
    throw error;
  }
};

/**
 * Calculate the vote percentage for candidates based on the total votes for their position
 * @param {Array} candidates - Array of candidate objects (can be Sequelize models or raw SQL results)
 * @returns {Array} - Array of candidate objects with calculated vote_percentage
 */
export const calculateVotePercentages = async (candidates) => {
  try {
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return [];
    }

    // Ensure we're working with plain objects
    const plainCandidates = candidates.map(candidate => 
      candidate.toJSON ? candidate.toJSON() : {...candidate}
    );

    // Group candidates by position_id
    const positionMap = new Map();
    plainCandidates.forEach(candidate => {
      const positionId = candidate.position_id;
      if (!positionMap.has(positionId)) {
        positionMap.set(positionId, []);
      }
      positionMap.get(positionId).push(candidate);
    });

    // Calculate total votes for each position
    const positionTotals = new Map();
    for (const [positionId, candidateList] of positionMap.entries()) {
      // Ensure votes is a number
      const totalVotes = candidateList.reduce((sum, candidate) => {
        const votes = typeof candidate.votes === 'string' 
          ? parseInt(candidate.votes, 10) 
          : (candidate.votes || 0);
        return sum + votes;
      }, 0);
      positionTotals.set(positionId, totalVotes);
    }

    // Calculate percentages
    return plainCandidates.map(candidate => {
      const candidateObject = {...candidate};
      const positionTotal = positionTotals.get(candidate.position_id) || 0;
      const votes = typeof candidate.votes === 'string' 
        ? parseInt(candidate.votes, 10) 
        : (candidate.votes || 0);
      
      // Avoid division by zero
      if (positionTotal > 0) {
        candidateObject.vote_percentage = parseFloat(((votes / positionTotal) * 100).toFixed(2));
      } else {
        candidateObject.vote_percentage = 0;
      }
      
      return candidateObject;
    });
  } catch (error) {
    logger.error(`Error calculating vote percentages: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate the position totals map for vote percentage calculations
 * @returns {Map} - Map of position_id to total votes for that position
 */
export const getPositionTotals = async () => {
  try {
    // Get total votes per position using raw SQL for efficiency
    const [results] = await sequelize.query(`
      SELECT position_id, SUM(votes) as total_votes
      FROM tbl_candidates
      GROUP BY position_id
    `);
    
    // Convert to a map for easy lookup
    const positionTotals = new Map();
    results.forEach(result => {
      positionTotals.set(result.position_id, result.total_votes);
    });
    
    return positionTotals;
  } catch (error) {
    logger.error(`Error getting position totals: ${error.message}`);
    throw error;
  }
}; 