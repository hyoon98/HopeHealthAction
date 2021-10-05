const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../config/database');
const Referral = require('./referral');

const PhysiotherapyService = db.define('PhysiotherapyService', {
    PhysiotherapyServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    Photo: {
        type: Sequelize.BLOB('long'),
        allowNull: true
    },
    ClientCondition: {
        type: Sequelize.ARRAY(Sequelize.ENUM({
            values: [
                'Amputee', 'Polio', 'Spinal Cord Injury',
                'Cerebral Palsy', 'Spina Bifida', 'Hydrocephalus',
                'Visual Impairment','Hearing Impairment', 'Other'
            ]
          })
        ),
        allowNull: false
    },
    OtherClientCondition: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'PhysiotherapyService',
    timestamps: false
});

//Define associations here
PhysiotherapyService.hasOne(Referral, {
    foreignKey: {
        name: 'PhysiotherapyServiceId',
        type: Sequelize.UUID
    }
})

Referral.belongsTo(PhysiotherapyService, {foreignKey: 'PhysiotherapyServiceId', targetKey: 'PhysiotherapyServiceId', onDelete: 'cascade', hooks: true})

module.exports = PhysiotherapyService;