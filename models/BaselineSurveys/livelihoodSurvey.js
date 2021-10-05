const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const LivelihoodSurvey = db.define('LivelihoodSurvey', {
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
}, {
    tableName: 'LivelihoodSurvey',
    timestamps: false
});

LivelihoodSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'LivelihoodSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(LivelihoodSurvey, {foreignKey: 'LivelihoodSurveyId', targetKey: 'LivelihoodSurveyId', onDelete: 'cascade', hooks: true})

module.exports = LivelihoodSurvey;