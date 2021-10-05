const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const EmpowermentSurvey = db.define('EmpowermentSurvey', {
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
}, {
    tableName: 'EmpowermentSurvey',
    timestamps: false
});

EmpowermentSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'EmpowermentSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(EmpowermentSurvey, {foreignKey: 'EmpowermentSurveyId', targetKey: 'EmpowermentSurveyId', onDelete: 'cascade', hooks: true})

module.exports = EmpowermentSurvey;