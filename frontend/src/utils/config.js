/**
 * Application configuration from environment variables
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Application Information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Bicol Research Survey';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const DEBUG_MODE = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
export const DISABLE_LOADING = import.meta.env.VITE_DISABLE_LOADING === 'true';
export const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true';

// Environment
export const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV === 'production';
export const IS_DEVELOPMENT = import.meta.env.VITE_NODE_ENV === 'development';

// Debug utility that only logs in development mode
export const debug = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

export default {
  API_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_VERSION,
  ENABLE_ANALYTICS,
  DEBUG_MODE,
  DISABLE_LOADING,
  DEBUG_API,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  debug
}; 