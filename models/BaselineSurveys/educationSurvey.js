const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const EducationSurvey = db.define('EducationSurvey', {
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
}, {
    tableName: 'EducationSurvey',
    timestamps: false
});

EducationSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'EducationSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(EducationSurvey, {foreignKey: 'EducationSurveyId', targetKey: 'EducationSurveyId', onDelete: 'cascade', hooks: true})

module.exports = EducationSurvey;