'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    queryInterface.createTable('HealthForm', {
    HealthFormId: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      primaryKey: true
    },
    Wheelchair: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Prosthetic: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Orthotic: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    WheelchairRepair: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    HealthCenterReferral: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Advice: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Advocacy: {
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
      tableName: 'HealthForm',
      timestamps: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HealthForm');
  }
};
