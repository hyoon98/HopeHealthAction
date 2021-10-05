const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../config/database');
const Referral = require('./referral');

const OrthoticService = db.define('OrthoticService', {
    OrthoticServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Photo: {
        type: Sequelize.BLOB('long'),
        allowNull: true
    },
    InjuryPosition: {
        type: Sequelize.ENUM,
        values: ['Above elbow', 'Below elbow'],
        allowNull: false
    }
}, {
    tableName: 'OrthoticService',
    timestamps: false
});

//Define associations here
OrthoticService.hasOne(Referral, {
    foreignKey: {
        name: 'OrthoticServiceId',
        type: Sequelize.UUID
    }
})

Referral.belongsTo(OrthoticService, {foreignKey: 'OrthoticServiceId', targetKey: 'OrthoticServiceId', onDelete: 'cascade', hooks: true})

module.exports = OrthoticService;