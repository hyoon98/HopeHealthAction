'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeConstraint('Client', 'Client_WorkerId_fkey');
    queryInterface.addConstraint('Client', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Client_WorkerId_fkey',
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
    queryInterface.removeConstraint('Client', 'Client_WorkerId_fkey');
    queryInterface.addConstraint('Client', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Client_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      }
    });
  }
};
