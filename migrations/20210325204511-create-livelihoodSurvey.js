'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LivelihoodSurvey',{
      LivelihoodSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      WorkStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      WorkDescription: {
        type: Sequelize.STRING,
        allowNull: true
      },
      EmploymentType: {
        type: Sequelize.ENUM,
        values: ['Employed', 'Self-employed'],
        allowNull: true
      },
      FinancialNeedsMet: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      DisabilityImpact: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      WorkWanted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LivelihoodSurvey');
  }
};