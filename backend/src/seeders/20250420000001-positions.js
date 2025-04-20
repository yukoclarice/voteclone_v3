'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_positions', [
      {
        id: 1,
        name: 'President'
      },
      {
        id: 2,
        name: 'Vice President'
      },
      {
        id: 3,
        name: 'Senator'
      },
      {
        id: 4,
        name: 'Party List'
      },
      {
        id: 5,
        name: 'Governor'
      },
      {
        id: 6,
        name: 'Vice Governor'
      },
      {
        id: 7,
        name: 'Mayor'
      },
      {
        id: 8,
        name: 'Vice Mayor'
      },
      {
        id: 9,
        name: 'Councilor'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_positions', null, {});
  }
}; 