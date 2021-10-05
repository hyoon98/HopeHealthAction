'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Referral', 'Referral_OrthoticServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_PhysiotherapyServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_ProstheticServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_WheelchairServiceId_fkey')

    queryInterface.addConstraint('Referral', {
      fields: ['OrthoticServiceId'],
      type: 'foreign key',
      name: 'Referral_OrthoticServiceId_fkey',
      references: {
        table: 'OrthoticService',
        field: 'OrthoticServiceId'
      },
      onDelete: 'cascade'
    })

    queryInterface.addConstraint('Referral', {
      fields: ['PhysiotherapyServiceId'],
      type: 'foreign key',
      name: 'Referral_PhysiotherapyServiceId_fkey',
      references: {
        table: 'PhysiotherapyService',
        field: 'PhysiotherapyServiceId'
      },
      onDelete: 'cascade'
    })
    
    queryInterface.addConstraint('Referral', {
      fields: ['ProstheticServiceId'],
      type: 'foreign key',
      name: 'Referral_ProstheticServiceId_fkey',
      references: {
        table: 'ProstheticService',
        field: 'ProstheticServiceId'
      },
      onDelete: 'cascade'
    })

    queryInterface.addConstraint('Referral', {
      fields: ['WheelchairServiceId'],
      type: 'foreign key',
      name: 'Referral_WheelchairServiceId_fkey',
      references: {
        table: 'WheelchairService',
        field: 'WheelchairServiceId'
      },
      onDelete: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Referral', 'Referral_OrthoticServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_PhysiotherapyServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_ProstheticServiceId_fkey')
    queryInterface.removeConstraint('Referral', 'Referral_WheelchairServiceId_fkey')

    queryInterface.addConstraint('Referral', {
      fields: ['OrthoticServiceId'],
      type: 'foreign key',
      name: 'Referral_OrthoticServiceId_fkey',
      references: {
        table: 'OrthoticService',
        field: 'OrthoticServiceId'
      }
    })

    queryInterface.addConstraint('Referral', {
      fields: ['PhysiotherapyServiceId'],
      type: 'foreign key',
      name: 'Referral_PhysiotherapyServiceId_fkey',
      references: {
        table: 'PhysiotherapyService',
        field: 'PhysiotherapyServiceId'
      }
    })
    
    queryInterface.addConstraint('Referral', {
      fields: ['ProstheticServiceId'],
      type: 'foreign key',
      name: 'Referral_ProstheticServiceId_fkey',
      references: {
        table: 'ProstheticService',
        field: 'ProstheticServiceId'
      }
    })

    queryInterface.addConstraint('Referral', {
      fields: ['WheelchairServiceId'],
      type: 'foreign key',
      name: 'Referral_WheelchairServiceId_fkey',
      references: {
        table: 'WheelchairService',
        field: 'WheelchairServiceId'
      }
    })
  }
};
