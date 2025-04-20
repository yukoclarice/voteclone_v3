'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_provinces', {
      code: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      region_code: {
        type: Sequelize.STRING(9),
        allowNull: false
      },
      island_group_code: {
        type: Sequelize.ENUM('luzon', 'visayas', 'mindanao'),
        allowNull: false
      },
      psgc10_digit_code: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      no_of_districts: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('tbl_provinces', ['island_group_code']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_provinces');
  }
}; 