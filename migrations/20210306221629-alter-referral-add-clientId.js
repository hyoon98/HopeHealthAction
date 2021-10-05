'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn(
        'Referral', 'ClientId',
        { type: Sequelize.INTEGER,
            references: {
                model: 'Client',
                key: 'ClientId'
            }
        });
  },

  down: async (queryInterface, Sequelize) => {
    // intentionally blank
  }
};
