'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HealthSurvey',{
      HealthSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      HealthStatus: {
        type: Sequelize.ENUM,
        values: ['Very Poor', 'Poor', 'Fine', 'Good'],
        allowNull: false
      },
      RehabilitationAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      RehabilitationAccessNeeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      AssistiveDevice: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      AssistiveDeviceWorking: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      AssistiveDeviceNeeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      AssistiveDeviceRequired: {
        type: Sequelize.ARRAY(Sequelize.ENUM({
              values: [
                'Wheelchair',
                'Prosthetic',
                'Orthotic',
                'Crutch',
                'Walking Stick',
                'Hearing Aid',
                'Glasses',
                'Standing Frame',
                'Corner Seat'
              ]
            })
        ),
        allowNull: true
      },
      HealthServiceStatus: {
        type: Sequelize.ENUM,
        values: ['Very Poor', 'Poor', 'Fine', 'Good'],
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HealthSurvey');
  }
};
