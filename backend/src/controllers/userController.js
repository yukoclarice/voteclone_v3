import { submitVote, checkDuplicateVoter } from '../services/userService.js';
import { logger } from '../utils/logger.js';

/**
 * Get the real client IP address, considering proxies and load balancers
 * @param {Object} req - Express request object
 * @returns {String} - Client IP address
 */
const getClientIP = (req) => {
  // Check for forwarded IP (when behind a proxy/load balancer)
  const forwardedFor = req.headers['x-forwarded-for'];
  
  if (forwardedFor) {
    // x-forwarded-for can be comma-separated list of IPs
    // The client's IP is the first one in the list
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0];
  }
  
  // Check other common headers
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }
  
  // Fall back to the connection's remote address
  // If req.ip is available (express provides this), use it
  const ip = req.ip || req.connection.remoteAddress;
  
  // If the IP is IPv6 localhost (::1), convert to IPv4 format
  if (ip === '::1') {
    return '127.0.0.1';
  }
  
  // Handle IPv4 mapped to IPv6 format (::ffff:127.0.0.1)
  if (ip && ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  
  return ip;
};

/**
 * Submit a vote
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const vote = async (req, res) => {
  try {
    const { userInfo, votes } = req.body;
    const ipAddress = getClientIP(req);
    
    logger.info(`Vote submission attempt from IP: ${ipAddress}`);
    
    // This validation is redundant with our express-validator middleware,
    // but we'll keep it as a safety check
    if (!userInfo || !votes) {
      logger.warn('Missing userInfo or votes in request body');
      return res.status(400).json({
        success: false,
        message: 'User information and votes are required'
      });
    }
    
    // Log vote details for debugging
    logger.debug(`Vote details: ${JSON.stringify({
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      senatorCount: votes.senators?.length || 0,
      hasPartyList: !!votes.partyList,
      hasGovernor: !!votes.governor,
      ipAddress: ipAddress
    })}`);
    
    // Check for duplicate voter
    const duplicateCheck = await checkDuplicateVoter(userInfo, ipAddress);
    if (!duplicateCheck.success) {
      logger.warn(`Duplicate voter detected: ${userInfo.email}`);
      return res.status(400).json({
        success: false,
        message: 'You already voted'
      });
    }
    
    // Submit votes
    const result = await submitVote(userInfo, votes, ipAddress);
    
    if (result.success) {
      console.log(`[VOTE RECORDED] User ${userInfo.email} vote submitted successfully from IP ${ipAddress}`);
      logger.info(`Vote successfully recorded for: ${userInfo.email}`);
      return res.status(200).json(result);
    } else {
      logger.warn(`Vote submission failed: ${result.message}`);
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