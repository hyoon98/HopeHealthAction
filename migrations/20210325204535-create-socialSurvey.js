'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SocialSurvey',{
      SocialSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ValuedCommunityMember: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Independence: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      CommunityParticipation: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      DisabilityImpact: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Discrimination: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SocialSurvey');
  }
};