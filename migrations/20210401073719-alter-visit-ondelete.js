'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeConstraint('Visit', 'Visit_WorkerId_fkey');
    queryInterface.addConstraint('Visit', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Visit_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      },
      onDelete: 'SET NULL'
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeConstraint('Visit', 'Visit_WorkerId_fkey');
    queryInterface.addConstraint('Visit', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Visit_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      }
    });
  }
};