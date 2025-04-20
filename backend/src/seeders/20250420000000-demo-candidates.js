'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('candidates', [
      {
        name: 'Erwin Tulfo',
        position: 'Governor',
        party: 'PDP-Laban',
        province: 'Albay',
        bio: 'Veteran journalist and broadcaster with experience in public service.',
        image_url: 'https://example.com/images/erwin-tulfo.jpg',
        votes: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bam Aquino',
        position: 'Governor',
        party: 'Liberal Party',
        province: 'Camarines Sur',
        bio: 'Former senator focusing on education and entrepreneurship.',
        image_url: 'https://example.com/images/bam-aquino.jpg',
        votes: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kiko Pangilinan',
        position: 'Governor',
        party: 'Liberal Party',
        province: 'Sorsogon',
        bio: 'Advocate for agricultural modernization and farmers\' rights.',
        image_url: 'https://example.com/images/kiko-pangilinan.jpg',
        votes: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pia Cayetano',
        position: 'Vice Governor',
        party: 'Nacionalista Party',
        province: 'Masbate',
        bio: 'Champion for women\'s rights and health programs.',
        image_url: 'https://example.com/images/pia-cayetano.jpg',
        votes: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lito Lapid',
        position: 'Vice Governor',
        party: 'Nationalist People\'s Coalition',
        province: 'Catanduanes',
        bio: 'Former actor and public servant with grassroots support.',
        image_url: 'https://example.com/images/lito-lapid.jpg',
        votes: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('candidates', null, {});
  }
}; 