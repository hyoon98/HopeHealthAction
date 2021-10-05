const Sequelize = require('sequelize');
const db = require('../config/database');
const Visit = require('./VisitForms/visit');
const Referral = require('./ReferralForms/referral');
const BaselineSurvey = require('./BaselineSurveys/baselineSurvey');

const Client = db.define('Client', {
    ClientId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FirstName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    LastName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Gender: {
        type: Sequelize.ENUM,
        values: ['Male', 'Female'],
        allowNull: false
    },
    Location: {
        type: Sequelize.ENUM,
        values: ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
            'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'],
        allowNull: false
    },
    DateCreated: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    ContactNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    VillageNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DisabilityType: {
        type: Sequelize.ARRAY(Sequelize.ENUM({
                values: [
                    'Amputee', 'Polio',
                    'Spinal Cord Injury',
                    'Cerebral Palsy',
                    'Spina Bifida',
                    'Hydrocephalus',
                    'Visual Impairment',
                    'Hearing Impairment',
                    'Don\'t Know', 'Other'
                ]
            })
        ),
        allowNull: true,
        validate: {
            nonNull(val) {
                if (val == null) {
                    throw new Error('Value must be non-null.')
                }
            }
        }
    },
    Photo: {
        type: Sequelize.BLOB('long'),
        allowNull: false
    },
    GPSLocation: {
        type: Sequelize.STRING
    },
    Consent: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: false
    },
    CaregiverName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    CaregiverState: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: false
    },
    CaregiverContactNo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'N/A'
    },
    HealthStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    HealthDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    HealthGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EducationStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    EducationDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EducationGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    SocialStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    SocialDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    SocialGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }

}, {
    tableName: 'Client',
    timestamps: false
});

//Define associations here
Client.hasMany(Visit, {
    foreignKey:{
        name: 'ClientId',
        type: Sequelize.INTEGER
    }
});
Client.hasMany(Referral, {
    foreignKey:{
        name: 'ClientId',
        type: Sequelize.UUID
    }
});
Client.hasOne(BaselineSurvey, {
    foreignKey:{
        name:'ClientId',
        type: Sequelize.INTEGER
    }
});

Visit.belongsTo(Client, {foreignKey:'ClientId', targetKey: 'ClientId', onDelete: 'cascade'});
Referral.belongsTo(Client, {foreignKey: 'ClientId', targetKey: 'ClientId', onDelete: 'cascade'});
BaselineSurvey.belongsTo(Client, {foreignKey: 'ClientId', targetKey: 'ClientId', onDelete: 'cascade'});

// Define Hooks here
function calculatePriority(client) {
    const statusLevelWeights = {
        'HealthStatus': 5,
        'EducationStatus': 3,
        'SocialStatus': 1
    }

    const riskLevelWeights = {
        'Critical Risk': 4,
        'High Risk': 3,
        'Medium Risk': 2,
        'Low Risk': 1
    }

    const clientRiskLevels = Object.entries(client.dataValues)
        .filter((entry) => {
            const [key, val] = entry;
            return statusLevelWeights.hasOwnProperty(key);
    });

    const mappedPriorities = clientRiskLevels.map((entry) => {
        const [key, val] = entry;
        return riskLevelWeights[val] * statusLevelWeights[key];
    });

    return mappedPriorities.reduce((a, b) => a + b, 0);
}

Client.beforeCreate(client => {
    client.Priority = calculatePriority(client);
});

Client.beforeUpdate(client => {
    client.Priority = calculatePriority(client);
});

module.exports = Client;