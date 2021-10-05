const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const ShelterSurvey = db.define('ShelterSurvey', {
    ShelterSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    ShelterAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    EssentialsAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'ShelterSurvey',
    timestamps: false
});

ShelterSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'ShelterSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(ShelterSurvey, {foreignKey: 'ShelterSurveyId', targetKey: 'ShelterSurveyId', onDelete: 'cascade', hooks: true})

module.exports = ShelterSurvey;