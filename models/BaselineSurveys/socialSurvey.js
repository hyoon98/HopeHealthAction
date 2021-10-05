const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const SocialSurvey = db.define('SocialSurvey', {
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
}, {
    tableName: 'SocialSurvey',
    timestamps: false
});

SocialSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'SocialSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(SocialSurvey, {foreignKey: 'SocialSurveyId', targetKey: 'SocialSurveyId', onDelete: 'cascade', hooks: true})

module.exports = SocialSurvey;