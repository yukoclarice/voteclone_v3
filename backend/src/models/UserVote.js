import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class UserVote extends Model {}

UserVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'id'
      }
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_candidates',
        key: 'id'
      }
    },
    voted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'UserVote',
    tableName: 'tbl_user_votes',
    timestamps: false, // No timestamps in this model
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'candidate_id']
      }
    ]
  }
);

export default UserVote; 