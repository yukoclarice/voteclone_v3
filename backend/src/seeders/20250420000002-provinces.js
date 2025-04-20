'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_provinces', [
      {
        code: '0505',
        name: 'Albay',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0505000000',
        no_of_districts: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: '0516',
        name: 'Camarines Norte',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0516000000',
        no_of_districts: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: '0517',
        name: 'Camarines Sur',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0517000000',
        no_of_districts: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: '0520',
        name: 'Catanduanes',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0520000000',
        no_of_districts: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: '0541',
        name: 'Masbate',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0541000000',
        no_of_districts: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: '0562',
        name: 'Sorsogon',
        region_code: '05',
        island_group_code: 'luzon',
        psgc10_digit_code: '0562000000',
        no_of_districts: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_provinces', null, {});
  }
}; 