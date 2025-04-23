import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(255),
      field: 'first_name',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING(255),
      field: 'last_name',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    mobileNumber: {
      type: DataTypes.CHAR(11),
      field: 'mobile_number',
      allowNull: false,
      unique: true,
      validate: {
        is: /^0[0-9]{10}$/,
        notEmpty: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    sex: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
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
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address',
      allowNull: false
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
    modelName: 'User',
    tableName: 'tbl_users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['mobile_number']
      },
      {
        fields: ['ip_address']
      }
    ]
  }
);

export default User; 