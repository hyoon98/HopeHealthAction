const Sequelize = require('sequelize');
const db = require('../../config/database');

const BaselineSurvey = db.define('BaselineSurvey', {
    BaselineSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
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

}, {
    tableName: 'BaselineSurvey',
    timestamps: false
});

// Define hooks here
BaselineSurvey.beforeCreate(async newSurvey => {
    const surveys = await BaselineSurvey.findAll();
    const matching = surveys.filter(survey => survey.dataValues.ClientId === newSurvey.ClientId);
    if (matching.length > 0) {
        throw 'Only one Baseline Survey allowed per Client';
    }
});

module.exports = BaselineSurvey;