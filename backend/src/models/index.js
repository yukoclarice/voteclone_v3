import { sequelize } from '../config/db.js';
import User from './User.js';
import Candidate from './Candidate.js';
import Province from './Province.js';
import Position from './Position.js';
import Total from './Total.js';
import UserVote from './UserVote.js';

// Define associations
// Create associations between models

// Position and Candidate association
Position.hasMany(Candidate, {
  as: 'candidates',
  foreignKey: 'position_id'
});

Candidate.belongsTo(Position, {
  as: 'position',
  foreignKey: 'position_id'
});

// Province and Candidate association
Province.hasMany(Candidate, {
  as: 'candidates',
  foreignKey: 'province_code',
  sourceKey: 'code'
});

Candidate.belongsTo(Province, {
  as: 'province',
  foreignKey: 'province_code',
  targetKey: 'code'
});

// Province and User association
Province.hasMany(User, {
  as: 'users',
  foreignKey: 'province_code',
  sourceKey: 'code'
});

User.belongsTo(Province, {
  as: 'province',
  foreignKey: 'province_code',
  targetKey: 'code'
});

// User and Candidate associations through UserVote
User.belongsToMany(Candidate, {
  through: UserVote,
  foreignKey: 'user_id',
  otherKey: 'candidate_id',
  as: 'votedCandidates'
});

Candidate.belongsToMany(User, {
  through: UserVote,
  foreignKey: 'candidate_id',
  otherKey: 'user_id',
  as: 'voters'
});

// To enable querying from both sides with proper types
// NOTE: Only needed for associations with non-standard key fields
Candidate.addScope('withProvince', {
  include: [{ 
    model: Province, 
    as: 'province'
  }]
});

Candidate.addScope('withPosition', {
  include: [{ 
    model: Position, 
    as: 'position'
  }]
});

User.addScope('withProvince', {
  include: [{ 
    model: Province, 
    as: 'province'
  }]
});

// Export all models
export {
  sequelize,
  User,
  Candidate,
  Province,
  Position,
  Total,
  UserVote
}; 