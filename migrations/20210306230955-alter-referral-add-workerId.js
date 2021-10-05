'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn(
        'Referral', 'WorkerId',
        { type: Sequelize.UUID,
            references: {
                model: 'Worker',
                key: 'WorkerId'
            }
        });
  },

  down: async (queryInterface, Sequelize) => {
    // intentionally blank
  }
};
