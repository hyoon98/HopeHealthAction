const Sequelize = require('sequelize');
const db = require('../../config/database');
const Visit = require('./visit');

const HealthForm = db.define('HealthForm', {
    HealthFormId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    }
}, {
    tableName: 'HealthForm',
    timestamps: false
});

//Define associations here
HealthForm.hasOne(Visit, {
  foreignKey:{
    name: 'HealthFormId',
    type: Sequelize.UUID
  }
})
Visit.belongsTo(HealthForm, {foreignKey: 'HealthFormId', targetKey: 'HealthFormId', onDelete: 'cascade', hooks: true})

module.exports = HealthForm;