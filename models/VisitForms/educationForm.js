const Sequelize = require('sequelize');
const db = require('../../config/database');
const Visit = require('./visit');

const EducationForm = db.define('EducationForm', {
    EducationFormId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    }
}, {
    tableName: 'EducationForm',
    timestamps: false
});

//Define associations here
EducationForm.hasOne(Visit, {
  foreignKey:{
    name: 'EducationFormId',
    type: Sequelize.UUID
  }
})
Visit.belongsTo(EducationForm, {foreignKey: 'EducationFormId', targetKey: 'EducationFormId', onDelete: 'cascade', hooks: true})

module.exports = EducationForm;