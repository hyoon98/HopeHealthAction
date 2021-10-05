'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Client', 'VillageNo', {
      type: 'INTEGER USING CAST("VillageNo" as INTEGER)'
    });
    await queryInterface.renameColumn('Client', 'VillageNo', 'VillageNumber');
  },

  down: async (queryInterface, Sequelize) => {
    // functionality to run when calling "undo"
    await queryInterface.renameColumn('Client', 'VillageNumber', 'VillageNo');
    await queryInterface.changeColumn('Client', 'VillageNo', {
        type: Sequelize.STRING,
    })
  }
};
