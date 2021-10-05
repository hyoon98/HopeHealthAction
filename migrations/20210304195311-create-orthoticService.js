'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('OrthoticService', { 
      OrthoticServiceId: {
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
          values: ['Above elbow', 'Below elbow'],
          allowNull: false
      }
    }, {
      tableName: 'OrthoticService',
      timestamps: false
    });
    
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.dropTable('OrthoticService');
    
  }
};
