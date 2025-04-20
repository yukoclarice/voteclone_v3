import { sequelize } from './db.js';
import { logger } from '../utils/logger.js';

// Run all migrations in sequence
export const runMigrations = async () => {
  try {
    // Wait for database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Run migrations in order
    // ... existing migrations ...
    
    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error(`Error running migrations: ${error.message}`);
    throw error;
  }
};

export default runMigrations; 