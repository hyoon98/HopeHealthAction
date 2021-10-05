'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_ClientId_fkey');

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'BaselineSurvey_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      },
      onDelete: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_ClientId_fkey');

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'BaselineSurvey_ClientId_fkey',
      references: {
        table: 'Client',
        field: 'ClientId'
      }
    });
  }
};
