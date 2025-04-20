'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_candidates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      position_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_positions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ballot_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      party: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      party_code: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      province_code: {
        type: Sequelize.STRING(9),
        allowNull: true,
        references: {
          model: 'tbl_provinces',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      district: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      municipality_code: {
        type: Sequelize.STRING(9),
        allowNull: true
      },
      picture: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      vote_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.addIndex('tbl_candidates', ['position_id']);
    await queryInterface.addIndex('tbl_candidates', ['province_code']);
    await queryInterface.addIndex('tbl_candidates', ['ballot_no']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_candidates');
  }
}; 