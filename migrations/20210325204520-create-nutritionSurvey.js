'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NutritionSurvey',{
      NutritionSurveyId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      FoodStatus: {
        type: Sequelize.ENUM,
        values: ['Very Poor', 'Poor', 'Fine', 'Good'],
        allowNull: false
      },
      MonthlyFoodAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      ChildNutritionStatus: {
        type: Sequelize.ENUM,
        values: ['Malnourished', 'Undernourished', 'Well Nourished'],
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NutritionSurvey');
  }
};