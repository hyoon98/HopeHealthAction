'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      Username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Role: {
        type: Sequelize.ENUM,
        values: ['Worker', 'Admin'],
        allowNull: false
      },
      WorkerId: {
        type: Sequelize.UUID,
        references: {
            model: 'Worker',
            key: 'WorkerId'
        }
      }
      },{
        tableName: 'User',
        timestamps: false
        });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};