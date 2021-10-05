'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('WheelchairService', { 
      WheelchairServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      Photo: {
          type: Sequelize.BLOB('long'),
          allowNull: true
      },
      ClientProficiency: {
          type: Sequelize.ENUM,
          values: ['Basic', 'Intermediate'],
          allowNull: false
      },
      ClientHipWidth: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      WheelchairExist: {
          type: Sequelize.ENUM,
          values: ['Y', 'N'],
          allowNull: false
      },
      WheelchairRepairable: {
          type: Sequelize.ENUM,
          values: ['Y', 'N'],
          allowNull: true
      }
    }, {
      tableName: 'WheelchairService',
      timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.dropTable('WheelchairService');
    
  }
};
