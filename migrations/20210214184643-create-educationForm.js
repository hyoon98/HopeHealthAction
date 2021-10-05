'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     
    queryInterface.createTable('EducationForm', {
    EducationFormId: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      primaryKey: true
    },
    Advice: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Advocacy: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    OrganizationReferral: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Encouragement: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    GoalMet: {
      type: Sequelize.ENUM,
      values: ['Canceled', 'Ongoing', 'Concluded'],
      allowNull: false
    },
    ConcludedOutcome: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    },{
      tableName: 'EducationForm',
      timestamps: true
    });
  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.dropTable('EducationForm');

  }
};
