import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Position extends Model {}

Position.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    sequelize,
    modelName: 'Position',
    tableName: 'tbl_positions',
    timestamps: false, // No timestamps in this table
    underscored: true
  }
);

export default Position; 