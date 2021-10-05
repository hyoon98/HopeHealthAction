const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../config/database');
const Referral = require('./referral');

const WheelchairService = db.define('WheelchairService', {
    WheelchairServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Photo: {
        type: Sequelize.BLOB('long'),
        allowNull: true
    },
    ClientProficiency: {
        type: Sequelize.ENUM,
        values: ['Basic', 'Intermediate'],
        allowNull: false
    },
    ClientHipWidth: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    WheelchairExist: {
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        allowNull: false
    },
    WheelchairRepairable: {
        type: Sequelize.ENUM,
        values: ['Y', 'N'],
        allowNull: true
    }
}, {
    tableName: 'WheelchairService',
    timestamps: false
});

//Define associations here
WheelchairService.hasOne(Referral, {
    foreignKey: {
        name: 'WheelchairServiceId',
        type: Sequelize.UUID
    }
})

Referral.belongsTo(WheelchairService, {foreignKey: 'WheelchairServiceId', targetKey: 'WheelchairServiceId', onDelete: 'cascade', hooks: true})

module.exports = WheelchairService;