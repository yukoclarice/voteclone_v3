import axios from 'axios';
import NProgress from 'nprogress';
import { API_URL, API_TIMEOUT, DEBUG_API } from './config';
import logger from './logger';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Add request interceptor for authentication and progress indicator
api.interceptors.request.use(
  (config) => {
    // Start progress bar
    NProgress.start();
    
    // Add auth token if available (for future authentication features)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (DEBUG_API) {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, 
                  config.params || config.data || '');
    }
    logger.debug('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    NProgress.done();
    if (DEBUG_API) {
      console.error('❌ API Request Error:', error.message);
    }
    logger.error('API Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and progress completion
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    if (DEBUG_API) {
      console.log(`✅ API Response (${response.status}): ${response.config.url}`, 
                  response.data);
    }
    logger.debug('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    NProgress.done();
    
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      if (DEBUG_API) {
        console.error(`❌ API Error (${error.response.status}): ${error.config?.url}`, 
                      error.response.data);
      }
      logger.error('API Error:', error.response.status, error.response.data);
      
      // Handle authentication errors (if adding auth later)
      if (error.response.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      // Request was made but no response received
      if (DEBUG_API) {
        console.error('❌ API Error: No response received', 
                      error.config?.url, error.request);
      }
      logger.error('API Error: No response received', error.request);
    } else {
      // Something else happened while setting up the request
      if (DEBUG_API) {
        console.error('❌ API Error:', error.message);
      }
      logger.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service for candidate operations
export const candidateService = {
  // Get all candidates with optional filters
  getAllCandidates: async (filters = {}) => {
    try {
      const response = await api.get('/candidates', { params: filters });
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to get all candidates:', error);
      }
      throw error;
    }
  },
  
  // Get all senator candidates
  getSenators: async (provinceCode = null) => {
    try {
      if (DEBUG_API) console.log('Fetching senators...');
      const params = provinceCode ? { province_code: provinceCode } : {};
      const response = await api.get('/candidates/senators', { params });
      if (DEBUG_API) console.log('Senators fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to get senators:', error);
      }
      throw error;
    }
  },
  
  // Get all party list candidates
  getPartyLists: async (provinceCode = null) => {
    try {
      if (DEBUG_API) console.log('Fetching party lists...');
      const params = provinceCode ? { province_code: provinceCode } : {};
      const response = await api.get('/candidates/party-lists', { params });
      if (DEBUG_API) console.log('Party lists fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to get party lists:', error);
      }
      throw error;
    }
  },
  
  // Get all governor candidates
  getGovernors: async (provinceCode = null) => {
    try {
      const params = provinceCode ? { province_code: provinceCode } : {};
      if (DEBUG_API) console.log(`Fetching governors for province: ${provinceCode || 'all'}`);
      const response = await api.get('/candidates/governors', { params });
      if (DEBUG_API) console.log('Governors fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error(`Failed to get governors for province ${provinceCode}:`, error);
      }
      throw error;
    }
  },
  
  // Get candidate by ID
  getCandidateById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
  
  // Create a new candidate (admin only)
  createCandidate: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },
  
  // Update an existing candidate (admin only)
  updateCandidate: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },
  
  // Delete a candidate (admin only)
  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
};

// API service for user and voting operations
export const userService = {
  // Submit a vote
  submitVote: async (voteData) => {
    try {
      if (DEBUG_API) console.log('Submitting vote with data:', voteData);
      
      // Ensure data is formatted correctly for the backend
      const { userInfo, votes } = voteData;
      
      // Validate required fields before sending
      if (!userInfo || !votes) {
        throw new Error('User information and votes are required');
      }
      
      const response = await api.post('/users/vote', {
        userInfo,
        votes
      });
      
      if (DEBUG_API) console.log('Vote submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to submit vote:', error);
      }
      throw error;
    }
  }
};

// API service for provinces
export const provinceService = {
  // Get all provinces
  getAllProvinces: async () => {
    try {
      if (DEBUG_API) console.log('Fetching all provinces...');
      const response = await api.get('/provinces');
      if (DEBUG_API) console.log('Provinces fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to get provinces:', error);
      }
      throw error;
    }
  }
};

// API service for status operations
export const statusService = {
  // Get voting status (open or closed)
  getVotingStatus: async () => {
    try {
      if (DEBUG_API) console.log('Fetching voting status...');
      const response = await api.get('/status/voting');
      if (DEBUG_API) console.log('Voting status fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (DEBUG_API) {
        console.error('Failed to get voting status:', error);
      }
      throw error;
    }
  }
};

export default api; 