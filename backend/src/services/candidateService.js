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