import { DEBUG_MODE, IS_DEVELOPMENT } from './config';

/**
 * Logger utility for consistent logging throughout the application
 * Only logs in development mode or when debug mode is enabled
 */
class Logger {
  constructor() {
    this.isEnabled = DEBUG_MODE || IS_DEVELOPMENT;
  }

  /**
   * Log information messages
   * @param {...any} args - Arguments to log
   */
  info(...args) {
    if (this.isEnabled) {
      console.info('%c INFO ', 'background: #3498db; color: white; border-radius: 3px;', ...args);
    }
  }

  /**
   * Log success messages
   * @param {...any} args - Arguments to log
   */
  success(...args) {
    if (this.isEnabled) {
      console.info('%c SUCCESS ', 'background: #2ecc71; color: white; border-radius: 3px;', ...args);
    }
  }

  /**
   * Log warning messages
   * @param {...any} args - Arguments to log
   */
  warn(...args) {
    if (this.isEnabled) {
      console.warn('%c WARNING ', 'background: #f39c12; color: white; border-radius: 3px;', ...args);
    }
  }

  /**
   * Log error messages
   * @param {...any} args - Arguments to log
   */
  error(...args) {
    if (this.isEnabled) {
      console.error('%c ERROR ', 'background: #e74c3c; color: white; border-radius: 3px;', ...args);
    }
  }

  /**
   * Log debug messages - only in debug mode
   * @param {...any} args - Arguments to log
   */
  debug(...args) {
    if (this.isEnabled) {
      console.debug('%c DEBUG ', 'background: #9b59b6; color: white; border-radius: 3px;', ...args);
    }
  }

  /**
   * Group log messages
   * @param {string} label - Group label
   * @param {Function} fn - Function to execute within group
   */
  group(label, fn) {
    if (this.isEnabled) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  }
}

export const logger = new Logger();
export default logger; 