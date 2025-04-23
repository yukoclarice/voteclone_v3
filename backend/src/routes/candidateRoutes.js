import express from 'express';
import {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getSenators,
  getPartyLists,
  getGovernors
} from '../controllers/candidateController.js';
import {
  validateCandidateData,
  validateCandidateId,
  validateCandidateQuery
} from '../validators/candidateValidator.js';

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates
 * @access  Public
 */
router.get('/', validateCandidateQuery, getAllCandidates);

/**
 * @route   GET /api/candidates/senators
 * @desc    Get all senator candidates
 * @access  Public
 */
router.get('/senators', validateCandidateQuery, getSenators);

/**
 * @route   GET /api/candidates/party-lists
 * @desc    Get all party list candidates
 * @access  Public
 */
router.get('/party-lists', validateCandidateQuery, getPartyLists);

/**
 * @route   GET /api/candidates/governors
 * @desc    Get all governor candidates with optional province filtering
 * @access  Public
 */
router.get('/governors', validateCandidateQuery, getGovernors);

/**
 * @route   GET /api/candidates/:id
 * @desc    Get a candidate by ID
 * @access  Public
 */
router.get('/:id', validateCandidateId, getCandidateById);

/**
 * @route   POST /api/candidates
 * @desc    Create a new candidate
 * @access  Private/Admin
 */
router.post('/', validateCandidateData, createCandidate);

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update a candidate
 * @access  Private/Admin
 */
router.put('/:id', [validateCandidateId, validateCandidateData], updateCandidate);

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate
 * @access  Private/Admin
 */
router.delete('/:id', validateCandidateId, deleteCandidate);

export default router; 