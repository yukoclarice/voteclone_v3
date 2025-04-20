'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      party: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      province: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    
    // Add indexes for performance
    await queryInterface.addIndex('candidates', ['province']);
    await queryInterface.addIndex('candidates', ['position']);
    await queryInterface.addIndex('candidates', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('candidates');
  }
}; 