'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_candidates', [
      // Governors
      {
        id: 101,
        position_id: 5, // Governor
        ballot_no: 1,
        name: 'Erwin Tulfo',
        party: 'PDP-Laban',
        party_code: 'PDP',
        province_code: '0505', // Albay
        district: null,
        municipality_code: null,
        picture: '/images/candidates/erwin-tulfo.jpg',
        votes: 0,
        total_votes: 0,
        vote_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 102,
        position_id: 5, // Governor
        ballot_no: 2,
        name: 'Bam Aquino',
        party: 'Liberal Party',
        party_code: 'LP',
        province_code: '0517', // Camarines Sur
        district: null,
        municipality_code: null,
        picture: '/images/candidates/bam-aquino.jpg',
        votes: 0,
        total_votes: 0,
        vote_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 103,
        position_id: 5, // Governor
        ballot_no: 3,
        name: 'Kiko Pangilinan',
        party: 'Liberal Party',
        party_code: 'LP',
        province_code: '0562', // Sorsogon
        district: null,
        municipality_code: null,
        picture: '/images/candidates/kiko-pangilinan.jpg',
        votes: 0,
        total_votes: 0,
        vote_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Vice Governors
      {
        id: 201,
        position_id: 6, // Vice Governor
        ballot_no: 1,
        name: 'Pia Cayetano',
        party: 'Nacionalista Party',
        party_code: 'NP',
        province_code: '0541', // Masbate
        district: null,
        municipality_code: null,
        picture: '/images/candidates/pia-cayetano.jpg',
        votes: 0,
        total_votes: 0,
        vote_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 202,
        position_id: 6, // Vice Governor
        ballot_no: 2,
        name: 'Lito Lapid',
        party: 'Nationalist People\'s Coalition',
        party_code: 'NPC',
        province_code: '0520', // Catanduanes
        district: null,
        municipality_code: null,
        picture: '/images/candidates/lito-lapid.jpg',
        votes: 0,
        total_votes: 0,
        vote_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    // Initialize the totals table
    await queryInterface.bulkInsert('tbl_totals', [
      {
        total_voters: 0,
        is_closed: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_candidates', null, {});
    await queryInterface.bulkDelete('tbl_totals', null, {});
  }
}; 