const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const HealthSurvey = db.define('HealthSurvey', {
    HealthSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    HealthStatus: {
        type: Sequelize.ENUM,
        values: ['Very Poor', 'Poor', 'Fine', 'Good'],
        allowNull: false
    },
    RehabilitationAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    RehabilitationAccessNeeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    AssistiveDevice: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    AssistiveDeviceWorking: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    AssistiveDeviceNeeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    AssistiveDeviceRequired: {
        type: Sequelize.ARRAY(Sequelize.ENUM({
                values: [
                    'Wheelchair',
                    'Prosthetic',
                    'Orthotic',
                    'Crutch',
                    'Walking Stick',
                    'Hearing Aid',
                    'Glasses',
                    'Standing Frame',
                    'Corner Seat'
                ]
            })
        ),
        allowNull: true
    },
    HealthServiceStatus: {
        type: Sequelize.ENUM,
        values: ['Very Poor', 'Poor', 'Fine', 'Good'],
        allowNull: false
    }
}, {
    tableName: 'HealthSurvey',
    timestamps: false
});

HealthSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'HealthSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(HealthSurvey, {foreignKey: 'HealthSurveyId', targetKey: 'HealthSurveyId', onDelete: 'cascade', hooks: true})

module.exports = HealthSurvey;