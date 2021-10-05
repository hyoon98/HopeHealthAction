'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeConstraint('User', 'User_WorkerId_fkey');
    queryInterface.addConstraint('User', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'User_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      },
      onDelete: 'CASCADE'
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeConstraint('User', 'User_WorkerId_fkey');
    queryInterface.addConstraint('User', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'User_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      }
    });
  }
};
