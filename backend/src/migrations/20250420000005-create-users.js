'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      mobile_number: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sex: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(320),
        allowNull: false,
        unique: true
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    
    // Add indexes
    await queryInterface.addIndex('tbl_users', ['email']);
    await queryInterface.addIndex('tbl_users', ['mobile_number']);
    await queryInterface.addIndex('tbl_users', ['ip_address']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_users');
  }
}; 