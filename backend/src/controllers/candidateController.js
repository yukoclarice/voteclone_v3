import Candidate from '../models/Candidate.js';
import Position from '../models/Position.js';
import Province from '../models/Province.js';
import { logger } from '../utils/logger.js';
import { Op } from 'sequelize';
import { calculateVotePercentages, getPositionTotals } from '../services/candidateService.js';
import { sequelize } from '../config/db.js';

/**
 * Get all candidates
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllCandidates = async (req, res) => {
  try {
    const { position, province } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (position) filter.position_id = position;
    if (province) filter.province_code = province;
    
    const candidates = await Candidate.findAll({
      where: filter,
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code']
        }
      ],
      order: [
        ['position_id', 'ASC'],
        ['ballot_no', 'ASC']
      ]
    });
    
    // Calculate vote percentages based on total votes for each position
    const candidatesWithPercentages = await calculateVotePercentages(candidates);
    
    return res.status(200).json({
      success: true,
      count: candidatesWithPercentages.length,
      data: candidatesWithPercentages
    });
  } catch (error) {
    logger.error(`Error fetching candidates: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching candidates'
    });
  }
};

/**
 * Get senators (candidates with position_id = 1)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSenators = async (req, res) => {
  try {
    const { province_code } = req.query;
    
    // Base query to get all senators
    const query = {
      where: {
        position_id: 1 // ID for senator position
      },
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'picture', 'position_id'],
      order: [
        ['votes', 'DESC'] // Order by votes in descending order
      ]
    };
    
    let senators;
    
    if (province_code) {
      // If province_code is provided, we need to join with the user_votes and users tables
      // to count only votes from users in that province
      logger.info(`Fetching senators with votes from province: ${province_code}`);
      
      try {
        // Use raw SQL for the province-specific vote query
        // This gives us more control over the complex joins and aggregations
        const senatorData = await sequelize.query(`
          SELECT 
            c.id, 
            c.name, 
            c.party, 
            c.party_code, 
            c.ballot_no, 
            c.picture, 
            c.position_id,
            IFNULL(COUNT(DISTINCT CASE WHEN u.province_code = :province_code THEN uv.user_id ELSE NULL END), 0) AS votes
          FROM 
            tbl_candidates c
          LEFT JOIN 
            tbl_user_votes uv ON c.id = uv.candidate_id
          LEFT JOIN 
            tbl_users u ON uv.user_id = u.id
          WHERE 
            c.position_id = 1
          GROUP BY 
            c.id
          ORDER BY 
            votes DESC
        `, {
          replacements: { province_code },
          type: sequelize.QueryTypes.SELECT
        });
        
        // Ensure senatorData is an array and convert string votes to integers
        senators = Array.isArray(senatorData) ? senatorData.map(senator => ({
          ...senator,
          votes: parseInt(senator.votes, 10) || 0
        })) : [];
        
        if (!Array.isArray(senatorData)) {
          logger.warn('Senator data is not an array:', typeof senatorData);
        }
      } catch (sqlError) {
        logger.error('SQL Error in senator query:', sqlError);
        throw sqlError;
      }
    } else {
      // Use standard Sequelize query for all votes
      senators = await Candidate.findAll(query);
    }
    
    // Calculate vote percentages
    const senatorsWithPercentages = await calculateVotePercentages(senators);
    
    return res.status(200).json({
      success: true,
      count: senatorsWithPercentages.length,
      data: senatorsWithPercentages,
      filtered_by_province: !!province_code
    });
  } catch (error) {
    logger.error(`Error fetching senators: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching senators'
    });
  }
};

/**
 * Get party lists (candidates with position_id = 2)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPartyLists = async (req, res) => {
  try {
    const { province_code } = req.query;
    
    // Base query for party lists
    const query = {
      where: {
        position_id: 2 // ID for party list position
      },
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'picture', 'position_id'],
      order: [
        ['votes', 'DESC'] // Order by votes in descending order
      ]
    };
    
    let partyLists;
    
    if (province_code) {
      // If province_code is provided, filter votes by province
      logger.info(`Fetching party lists with votes from province: ${province_code}`);
      
      try {
        // Use raw SQL for the province-specific vote query
        const partyListData = await sequelize.query(`
          SELECT 
            c.id, 
            c.name, 
            c.party, 
            c.party_code, 
            c.ballot_no, 
            c.picture, 
            c.position_id,
            IFNULL(COUNT(DISTINCT CASE WHEN u.province_code = :province_code THEN uv.user_id ELSE NULL END), 0) AS votes
          FROM 
            tbl_candidates c
          LEFT JOIN 
            tbl_user_votes uv ON c.id = uv.candidate_id
          LEFT JOIN 
            tbl_users u ON uv.user_id = u.id
          WHERE 
            c.position_id = 2
          GROUP BY 
            c.id
          ORDER BY 
            votes DESC
        `, {
          replacements: { province_code },
          type: sequelize.QueryTypes.SELECT
        });
        
        // Ensure partyListData is an array and convert string votes to integers
        partyLists = Array.isArray(partyListData) ? partyListData.map(party => ({
          ...party,
          votes: parseInt(party.votes, 10) || 0
        })) : [];
        
        if (!Array.isArray(partyListData)) {
          logger.warn('Party list data is not an array:', typeof partyListData);
        }
      } catch (sqlError) {
        logger.error('SQL Error in party list query:', sqlError);
        throw sqlError;
      }
    } else {
      // Use standard Sequelize query for all votes
      partyLists = await Candidate.findAll(query);
    }
    
    // Calculate vote percentages
    const partyListsWithPercentages = await calculateVotePercentages(partyLists);
    
    return res.status(200).json({
      success: true,
      count: partyListsWithPercentages.length,
      data: partyListsWithPercentages,
      filtered_by_province: !!province_code
    });
  } catch (error) {
    logger.error(`Error fetching party lists: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching party lists'
    });
  }
};

/**
 * Get governors (candidates with position_id = 3)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGovernors = async (req, res) => {
  try {
    const { province_code } = req.query;
    const whereClause = {
      position_id: 3 // ID for governor position
    };
    
    // Add province filter if provided
    if (province_code) {
      whereClause.province_code = province_code;
    }
    
    const governors = await Candidate.findAll({
      where: whereClause,
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code']
        }
      ],
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'picture', 'province_code', 'position_id'],
      order: [
        ['province_code', 'ASC'],
        ['votes', 'DESC'] // Order by province, then by votes in descending order
      ]
    });
    
    // If province_code is provided, calculate percentages per province
    let governorsWithPercentages;
    if (province_code) {
      // When filtered by province, calculate percentages within that province only
      governorsWithPercentages = await calculateVotePercentages(governors);
      logger.debug('Governors with percentages:', governorsWithPercentages);
    } else {
      // When showing all governors, group them by province to calculate percentages within each province
      const provinceMap = new Map();
      
      // Group governors by province
      governors.forEach(governor => {
        const provinceCode = governor.province_code;
        if (!provinceMap.has(provinceCode)) {
          provinceMap.set(provinceCode, []);
        }
        provinceMap.get(provinceCode).push(governor);
      });
      
      // Calculate percentages for each province separately
      const allGovernorsWithPercentages = [];
      
      for (const provinceGovernors of provinceMap.values()) {
        const withPercentages = await calculateVotePercentages(provinceGovernors);
        allGovernorsWithPercentages.push(...withPercentages);
      }
      
      governorsWithPercentages = allGovernorsWithPercentages;
    }
    
    return res.status(200).json({
      success: true,
      count: governorsWithPercentages.length,
      data: governorsWithPercentages,
      filtered_by_province: !!province_code
    });
  } catch (error) {
    logger.error(`Error fetching governors: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching governors'
    });
  }
};

/**
 * Get a candidate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code']
        }
      ]
    });
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // For a single candidate, get all candidates with the same position to calculate percentage
    const positionCandidates = await Candidate.findAll({
      where: { position_id: candidate.position_id }
    });
    
    // Calculate percentage for this single candidate
    const [candidateWithPercentage] = await calculateVotePercentages([candidate]);
    
    return res.status(200).json({
      success: true,
      data: candidateWithPercentage
    });
  } catch (error) {
    logger.error(`Error fetching candidate by ID: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching candidate'
    });
  }
};

/**
 * Create a new candidate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    
    // Reload candidate with associations
    const newCandidate = await Candidate.findByPk(candidate.id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code']
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: newCandidate
    });
  } catch (error) {
    logger.error(`Error creating candidate: ${error.message}`);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while creating candidate'
    });
  }
};

/**
 * Update a candidate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    await candidate.update(req.body);
    
    // Reload candidate with associations
    const updatedCandidate = await Candidate.findByPk(candidate.id, {
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name']
        },
        {
          model: Province,
          as: 'province',
          attributes: ['code', 'name', 'region_code']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: updatedCandidate
    });
  } catch (error) {
    logger.error(`Error updating candidate: ${error.message}`);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while updating candidate'
    });
  }
};

/**
 * Delete a candidate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    await candidate.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting candidate: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting candidate'
    });
  }
}; 