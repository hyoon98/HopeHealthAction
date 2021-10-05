'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Visit', 'Visit_ClientId_fkey');
    queryInterface.removeConstraint('Referral', 'Referral_ClientId_fkey');

    queryInterface.addConstraint('Visit', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'Visit_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('Referral', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'Referral_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      },
      onDelete: 'cascade'
    });

  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Visit', 'Visit_ClientId_fkey');
    queryInterface.removeConstraint('Referral', 'Referral_ClientId_fkey');

    queryInterface.addConstraint('Visit', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'Visit_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      }
    });

    queryInterface.addConstraint('Referral', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'Referral_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      }
    });
  }
};
