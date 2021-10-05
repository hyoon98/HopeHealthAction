'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_HealthSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_EducationSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_EmpowermentSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_LivelihoodSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_NutritionSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_SocialSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_ShelterSurveyId_fkey');
  
    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['HealthSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_HealthSurveyId_fkey',
      references: {
        table: 'HealthSurvey',
        field: 'HealthSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['EducationSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_EducationSurveyId_fkey',
      references: {
        table: 'EducationSurvey',
        field: 'EducationSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['EmpowermentSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_EmpowermentSurveyId_fkey',
      references: {
        table: 'EmpowermentSurvey',
        field: 'EmpowermentSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['LivelihoodSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_LivelihoodSurveyId_fkey',
      references: {
        table: 'LivelihoodSurvey',
        field: 'LivelihoodSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['NutritionSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_NutritionSurveyId_fkey',
      references: {
        table: 'NutritionSurvey',
        field: 'NutritionSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['SocialSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_SocialSurveyId_fkey',
      references: {
        table: 'SocialSurvey',
        field: 'SocialSurveyId'
      },
      onDelete: 'cascade'
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['ShelterSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_ShelterSurveyId_fkey',
      references: {
        table: 'ShelterSurvey',
        field: 'ShelterSurveyId'
      },
      onDelete: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_HealthSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_EducationSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_EmpowermentSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_LivelihoodSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_NutritionSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_SocialSurveyId_fkey');
    queryInterface.removeConstraint('BaselineSurvey', 'BaselineSurvey_ShelterSurveyId_fkey');
  
    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['HealthSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_HealthSurveyId_fkey',
      references: {
        table: 'HealthSurvey',
        field: 'HealthSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['EducationSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_EducationSurveyId_fkey',
      references: {
        table: 'EducationSurvey',
        field: 'EducationSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['EmpowermentSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_EmpowermentSurveyId_fkey',
      references: {
        table: 'EmpowermentSurvey',
        field: 'EmpowermentSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['LivelihoodSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_LivelihoodSurveyId_fkey',
      references: {
        table: 'LivelihoodSurvey',
        field: 'LivelihoodSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['NutritionSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_NutritionSurveyId_fkey',
      references: {
        table: 'NutritionSurvey',
        field: 'NutritionSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['SocialSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_SocialSurveyId_fkey',
      references: {
        table: 'SocialSurvey',
        field: 'SocialSurveyId'
      }
    });

    queryInterface.addConstraint('BaselineSurvey', {
      fields: ['ShelterSurveyId'],
      type: 'foreign key',
      name: 'BaselineSurvey_ShelterSurveyId_fkey',
      references: {
        table: 'ShelterSurvey',
        field: 'ShelterSurveyId'
      }
    });
  }
};
