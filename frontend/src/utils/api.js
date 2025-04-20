import axios from 'axios';
import NProgress from 'nprogress';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
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
    
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and progress completion
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors (if adding auth later)
      if (error.response.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service for candidate operations
export const candidateService = {
  // Get all candidates with optional filters
  getAllCandidates: async (filters = {}) => {
    const response = await api.get('/candidates', { params: filters });
    return response.data;
  },
  
  // Get all senator candidates
  getSenators: async () => {
    const response = await api.get('/candidates/senators');
    return response.data;
  },
  
  // Get all party list candidates
  getPartyLists: async () => {
    const response = await api.get('/candidates/party-lists');
    return response.data;
  },
  
  // Get all governor candidates
  getGovernors: async (provinceCode = null) => {
    const params = provinceCode ? { province_code: provinceCode } : {};
    const response = await api.get('/candidates/governors', { params });
    return response.data;
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
    const response = await api.post('/users/vote', voteData);
    return response.data;
  }
};

export default api; 