'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('Referral', {
      ReferralId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      Date: {
          type: Sequelize.DATEONLY,
          defaultValue: Sequelize.NOW,
          allowNull: false
      },
      ServiceRequired: {
          type: Sequelize.ARRAY(Sequelize.ENUM({
              values: [
                  'Physiotherapy',
                  'Prosthetic', 
                  'Orthotic', 
                  'Wheelchair', 
                  'Other'
              ]
          })
        ),
        allowNull: false
      },
      OtherServices: {
          type: Sequelize.STRING,
          allowNull: true
      },
      ReferTo: {
          type: Sequelize.STRING,
          allowNull: false
      },
      Status: {
          type: Sequelize.ENUM,
          values: ['Made', 'Resolved'],
          allowNull: false
      },
      Outcome: {
          type: Sequelize.STRING,
          allowNull: true
      },
      WheelchairServiceId:{
        type: Sequelize.UUID,
        references: {
            model: 'WheelchairService',
            key: 'WheelchairServiceId'
        },
        allowNull: true
      },
      PhysiotherapyServiceId: {
        type: Sequelize.UUID,
        references: {
            model: 'PhysiotherapyService',
            key: 'PhysiotherapyServiceId'
        },
        allowNull: true
      },
      ProstheticServiceId: {
        type: Sequelize.UUID,
        references: {
            model: 'ProstheticService',
            key: 'ProstheticServiceId'
        },
        allowNull: true
      },
      OrthoticServiceId:{
        type: Sequelize.UUID,
        references: {
            model: 'OrthoticService',
            key: 'OrthoticServiceId'
        },
        allowNull: true
      }
    }, {
      tableName: 'Referral',
      timestamps: false
    });
     
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.dropTable('Referral');
     
  }
};
