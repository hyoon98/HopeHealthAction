'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    queryInterface.removeConstraint('Visit', 'Visit_HealthFormId_fkey')
    queryInterface.removeConstraint('Visit', 'Visit_SocialFormId_fkey')
    queryInterface.removeConstraint('Visit', 'Visit_EducationFormId_fkey')

    queryInterface.addConstraint('Visit', {
      fields: ['HealthFormId'],
      type: 'foreign key',
      name: 'Visit_HealthFormId_fkey',
      references: {
        table: 'HealthForm',
        field: 'HealthFormId'
      },
      onDelete: 'cascade'
    })

    queryInterface.addConstraint('Visit', {
      fields: ['SocialFormId'],
      type: 'foreign key',
      name: 'Visit_SocialFormId_fkey',
      references: {
        table: 'SocialForm',
        field: 'SocialFormId'
      },
      onDelete: 'cascade'
    })
    
    queryInterface.addConstraint('Visit', {
      fields: ['EducationFormId'],
      type: 'foreign key',
      name: 'Visit_EducationFormId_fkey',
      references: {
        table: 'EducationForm',
        field: 'EducationFormId'
      },
      onDelete: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Visit', 'Visit_HealthFormId_fkey')
    queryInterface.removeConstraint('Visit', 'Visit_SocialFormId_fkey')
    queryInterface.removeConstraint('Visit', 'Visit_EducationFormId_fkey')

    queryInterface.addConstraint('Visit', {
      fields: ['HealthFormId'],
      type: 'foreign key',
      name: 'Visit_HealthFormId_fkey',
      references: {
        table: 'HealthForm',
        field: 'HealthFormId'
      }
    })

    queryInterface.addConstraint('Visit', {
      fields: ['SocialFormId'],
      type: 'foreign key',
      name: 'Visit_SocialFormId_fkey',
      references: {
        table: 'SocialForm',
        field: 'SocialFormId'
      }
    })
    
    queryInterface.addConstraint('Visit', {
      fields: ['EducationFormId'],
      type: 'foreign key',
      name: 'Visit_EducationFormId_fkey',
      references: {
        table: 'EducationForm',
        field: 'EducationFormId'
      }
    })
  }
};
