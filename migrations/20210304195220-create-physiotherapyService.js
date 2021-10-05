'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('PhysiotherapyService', { 
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
     
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('PhysiotherapyService');
    
  }
};
