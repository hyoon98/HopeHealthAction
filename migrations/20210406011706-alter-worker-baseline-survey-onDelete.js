'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_WorkerId_fkey');
    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'BaselineSurvey_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      },
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_WorkerId_fkey');
    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'BaselineSurvey_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      }
    });
  }
};
