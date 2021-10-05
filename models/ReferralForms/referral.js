const Sequelize = require('sequelize');
const db = require('../../config/database');

const Referral = db.define('Referral', {
    ReferralId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    ServiceRequired: {
        type: Sequelize.ARRAY(Sequelize.ENUM({
            values: [
                'Physiotherapy',
                'Prosthetic', 
                'Orthotic', 
                'Wheelchair', 
                'Other'
            ]
        })
      ),
      allowNull: false
    },
    OtherServices: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ReferTo: {
        type: Sequelize.ENUM,
        values: ['Disability Center', 'Mobile Clinic'],
        allowNull: false
    },
    Status: {
        type: Sequelize.ENUM,
        values: ['Made', 'Resolved'],
        allowNull: false
    },
    Outcome: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'Referral',
    timestamps: false
});

module.exports = Referral;