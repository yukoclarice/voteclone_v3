import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Candidate extends Model {}

Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    positionId: {
      type: DataTypes.INTEGER,
      field: 'position_id',
      allowNull: false,
      references: {
        model: 'tbl_positions',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    ballotNo: {
      type: DataTypes.INTEGER,
      field: 'ballot_no',
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    party: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    partyCode: {
      type: DataTypes.STRING(50),
      field: 'party_code',
      allowNull: true
    },
    provinceCode: {
      type: DataTypes.STRING(9),
      field: 'province_code',
      allowNull: true,
      references: {
        model: 'tbl_provinces',
        key: 'code'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    district: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    municipalityCode: {
      type: DataTypes.STRING(9),
      field: 'municipality_code',
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING(255),
      field: 'picture',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      field: 'total_votes',
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    votePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'vote_percentage',
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Candidate',
    tableName: 'tbl_candidates',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['position_id']
      },
      {
        fields: ['province_code']
      },
      {
        fields: ['ballot_no']
      }
    ]
  }
);

export default Candidate; 