'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable('Worker', {
      WorkerId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      FirstName: {
          type: Sequelize.STRING(50),
          allowNull: false
      },
      LastName: {
          type: Sequelize.STRING(50),
          allowNull: false
      },
      Photo: {
        type: Sequelize.BLOB('long')
      },
      Location: {
          type: Sequelize.ENUM,
          values: ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
              'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'],
          allowNull: false
      }
    },{
    tableName: 'Worker',
    timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Worker');
  }
};
