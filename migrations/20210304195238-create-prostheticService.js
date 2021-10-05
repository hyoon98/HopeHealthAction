'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.createTable('ProstheticService', { 
      ProstheticServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      Photo: {
          type: Sequelize.BLOB('long'),
          allowNull: true
      },
      InjuryPosition: {
          type: Sequelize.ENUM,
          values: ['Above knee', 'Below knee'],
          allowNull: false
      } 
    }, {
      tableName: 'ProstheticService',
      timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('ProstheticService');
    
  }
};
