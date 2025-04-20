'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_votes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      voted_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    // Add unique constraint to prevent double voting
    await queryInterface.addIndex('tbl_user_votes', ['user_id', 'candidate_id'], {
      unique: true,
      name: 'unique_vote'
    });
    
    // Add index for performance
    await queryInterface.addIndex('tbl_user_votes', ['candidate_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_user_votes');
  }
}; 