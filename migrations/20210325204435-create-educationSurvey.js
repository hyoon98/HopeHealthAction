'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EducationSurvey',{
      EducationSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      SchoolState: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      CurrentGrade: {
        type: Sequelize.STRING,
        allowNull: true
      },
      NoSchoolReason: {
        type: Sequelize.ENUM,
        values: ['Lack of Funding', 'My Disability Stops me', 'Other'],
        allowNull: true
      },
      SchoolBefore: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      WantSchool: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EducationSurvey');
  }
};