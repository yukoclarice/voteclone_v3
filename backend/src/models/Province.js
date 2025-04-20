import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Province extends Model {}

Province.init(
  {
    code: {
      type: DataTypes.STRING(9),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    region_code: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    island_group_code: {
      type: DataTypes.ENUM('luzon', 'visayas', 'mindanao'),
      allowNull: false,
      validate: {
        isIn: [['luzon', 'visayas', 'mindanao']]
      }
    },
    psgc10_digit_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    no_of_districts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
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
    modelName: 'Province',
    tableName: 'tbl_provinces',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['island_group_code']
      }
    ]
  }
);

export default Province; 