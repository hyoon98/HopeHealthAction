'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BaselineSurvey',{
      BaselineSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      HealthSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'HealthSurvey',
          key: 'HealthSurveyId'
        },
        allowNull: true
      },
      SocialSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'SocialSurvey',
          key: 'SocialSurveyId'
        },
        allowNull: true
      },
      ShelterSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'ShelterSurvey',
          key: 'ShelterSurveyId'
        },
        allowNull: true
      },
      NutritionSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'NutritionSurvey',
          key: 'NutritionSurveyId'
        },
        allowNull: true
      },
      LivelihoodSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'LivelihoodSurvey',
          key: 'LivelihoodSurveyId'
        },
        allowNull: true
      },
      EmpowermentSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'EmpowermentSurvey',
          key: 'EmpowermentSurveyId'
        },
        allowNull: true
      },
      EducationSurveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'EducationSurvey',
          key: 'EducationSurveyId'
        },
        allowNull: true
      },
      WorkerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Worker',
          key: 'WorkerId'
        }
      },
      ClientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Client',
          key: 'ClientId'
        }
      },
      Date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      DateEdited: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull: true
      },

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BaselineSurvey');
  }
};
