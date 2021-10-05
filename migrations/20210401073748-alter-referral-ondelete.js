'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeConstraint('Referral', 'Referral_WorkerId_fkey');
    queryInterface.addConstraint('Referral', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Referral_WorkerId_fkey',
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
    queryInterface.removeConstraint('Referral', 'Referral_WorkerId_fkey');
    queryInterface.addConstraint('Referral', {
      fields: ['WorkerId'],
      type: 'foreign key',
      name: 'Referral_WorkerId_fkey',
      references: {
        table: 'Worker',
        field: 'WorkerId'
      }
    });
  }
};
