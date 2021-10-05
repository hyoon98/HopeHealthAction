'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmpowermentSurvey',{
      EmpowermentSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      DisabilityOrganizationMember: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      DisabilityOrganizations: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      AwareDisabilityRights: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Influential: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmpowermentSurvey');
  }
};