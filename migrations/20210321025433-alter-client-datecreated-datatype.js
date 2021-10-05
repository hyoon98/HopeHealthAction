'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Client', 'DateCreated', {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Client', 'DateCreated', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    })
  }
};
