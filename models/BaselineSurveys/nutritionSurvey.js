const Sequelize = require('sequelize');
const db = require('../../config/database');
const BaselineSurvey = require('./baselineSurvey')

const NutritionSurvey = db.define('NutritionSurvey', {
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
}, {
    tableName: 'NutritionSurvey',
    timestamps: false
});

NutritionSurvey.hasOne(BaselineSurvey, {
    foreignKey: {
        name: 'NutritionSurveyId',
        type: Sequelize.UUID
    }
});

BaselineSurvey.belongsTo(NutritionSurvey, {foreignKey: 'NutritionSurveyId', targetKey: 'NutritionSurveyId', onDelete: 'cascade', hooks: true})

module.exports = NutritionSurvey;