import Candidate from '../models/Candidate.js';
import Position from '../models/Position.js';
import Province from '../models/Province.js';
import { logger } from '../utils/logger.js';
import { Op } from 'sequelize';

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
    
    return res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
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
    const senators = await Candidate.findAll({
      where: {
        position_id: 1 // ID for senator position
      },
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'vote_percentage', 'picture'],
      order: [
        ['votes', 'DESC'] // Order by votes in descending order
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: senators.length,
      data: senators
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
    const partyLists = await Candidate.findAll({
      where: {
        position_id: 2 // ID for party list position
      },
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'vote_percentage', 'picture'],
      order: [
        ['votes', 'DESC'] // Order by votes in descending order
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: partyLists.length,
      data: partyLists
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
      attributes: ['id', 'name', 'party', 'party_code', 'ballot_no', 'votes', 'vote_percentage', 'picture', 'province_code'],
      order: [
        ['province_code', 'ASC'],
        ['votes', 'DESC'] // Order by province, then by votes in descending order
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: governors.length,
      data: governors
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
    
    return res.status(200).json({
      success: true,
      data: candidate
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