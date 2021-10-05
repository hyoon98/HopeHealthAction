const express = require('express');
const router = express.Router();
const BaselineSurvey = require('../models/BaselineSurveys/baselineSurvey');
const HealthSurvey = require('../models/BaselineSurveys/healthSurvey');
const EducationSurvey = require('../models/BaselineSurveys/educationSurvey');
const SocialSurvey = require('../models/BaselineSurveys/socialSurvey');
const NutritionSurvey = require('../models/BaselineSurveys/nutritionSurvey');
const ShelterSurvey = require('../models/BaselineSurveys/shelterSurvey');
const EmpowermentSurvey = require('../models/BaselineSurveys/empowermentSurvey');
const LivelihoodSurvey = require('../models/BaselineSurveys/livelihoodSurvey');
const { sequelize } = require('../models/BaselineSurveys/baselineSurvey');
const Client = require('../models/client')
const uuid = require('uuid');
const { Op } = require('sequelize');

function countColumn(model, colName, surveyId, surveyIdArr) {
    return model.count({
            col: [colName],
            where: {
                [Op.and]: [
                    { [colName]: true },
                    {
                      [surveyId]: { [Op.in]: surveyIdArr }
                    }
                ]}
        })
}

async function getSpecificSurveyStats(allSurveys, surveyNameWithId, specificSurveyTable, columnNameArr) {

    const ids = [];
    Object.keys(allSurveys).forEach(key => {
        ids.push(allSurveys[key][surveyNameWithId])
    })

    if (ids.length == 0) {
        return null;
    }

    let obj = {};
    await Promise.all(columnNameArr.map(async (colName) => {
        obj[colName + "Count"] = await countColumn(specificSurveyTable, colName, surveyNameWithId, ids);
    }));

    return obj;
}

async function getAllStats(allSurveys) {

    const allStatsObj = {};
    allStatsObj.Total = allSurveys.count;

    if (allSurveys.count == 0) {
        return allStatsObj;
    }

    const healthColumns = ['RehabilitationAccess', 'RehabilitationAccessNeeded',
    'AssistiveDevice','AssistiveDeviceWorking', 'AssistiveDeviceNeeded'];
    const socialColumns = ['ValuedCommunityMember', 'Independence',
    'CommunityParticipation','DisabilityImpact', 'Discrimination'];
    const educationColumns = ['SchoolState', 'SchoolBefore', 'WantSchool'];
    const livelihoodColumns = ['WorkStatus', 'FinancialNeedsMet',
    'DisabilityImpact','WorkWanted'];
    const nutritionColumns = ['MonthlyFoodAccess'];
    const empowermentColumns = ['DisabilityOrganizationMember', 'AwareDisabilityRights','Influential'];
    const shelterColumns = ['ShelterAccess', 'EssentialsAccess'];

    allStatsObj.HealthStats = await getSpecificSurveyStats(allSurveys.rows, 'HealthSurveyId', HealthSurvey, healthColumns);
    allStatsObj.SocialStats = await getSpecificSurveyStats(allSurveys.rows, 'SocialSurveyId', SocialSurvey, socialColumns);
    allStatsObj.EducationStats = await getSpecificSurveyStats(allSurveys.rows, 'EducationSurveyId', EducationSurvey, educationColumns);
    allStatsObj.LivelihoodStats = await getSpecificSurveyStats(allSurveys.rows, 'LivelihoodSurveyId', LivelihoodSurvey, livelihoodColumns);
    allStatsObj.NutritionStats = await getSpecificSurveyStats(allSurveys.rows, 'NutritionSurveyId', NutritionSurvey, nutritionColumns);
    allStatsObj.EmpowermentStats = await getSpecificSurveyStats(allSurveys.rows, 'EmpowermentSurveyId', EmpowermentSurvey, empowermentColumns);
    allStatsObj.ShelterStats = await getSpecificSurveyStats(allSurveys.rows, 'ShelterSurveyId', ShelterSurvey, shelterColumns);

    return allStatsObj;
}

// @route   /surveyStats/
// @desc    GET all survey stats
router.get('/', async (req,res) => {

    let transaction;
    try {
        transaction = await sequelize.transaction();

        const allSurveys = await BaselineSurvey.findAndCountAll({
            attributes: [
                'HealthSurveyId', 'SocialSurveyId', 'EducationSurveyId',
                'LivelihoodSurveyId', 'NutritionSurveyId', 'EmpowermentSurveyId', 'ShelterSurveyId'
            ],
        }, {transaction});

        await transaction.commit();

        allStatsObj = await getAllStats(allSurveys);
        res.status(200).json(allStatsObj);

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json(err);
    }
})

// @route   /surveyStats/location
// @desc    GET all survey stats from one location
router.get('/location/:loc', async (req,res) => {
    const location = req.params.loc;

    let transaction;
    try {
        transaction = await sequelize.transaction();

        const allSurveys = await BaselineSurvey.findAndCountAll({
            attributes: [
                'HealthSurveyId', 'SocialSurveyId', 'EducationSurveyId',
                'LivelihoodSurveyId', 'NutritionSurveyId', 'EmpowermentSurveyId', 'ShelterSurveyId'
            ],
            include: [{
                model: Client,
                required: true,
                where: {
                     Location: location
                },
                attributes: [
                    'ClientId', 'Location'
                ]
            }],
        }, {transaction});

        await transaction.commit();

        allStatsObj = await getAllStats(allSurveys);
        res.status(200).json(allStatsObj);

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json(err);
    }
})

// @route   /surveyStats/disability
// @desc    GET all survey stats with a certain disability
router.get('/disability/:disability', async (req,res) => {
    const disability = req.params.disability;

    let transaction;
    try {
        transaction = await sequelize.transaction();

        const allSurveys = await BaselineSurvey.findAndCountAll({
            attributes: [
                'HealthSurveyId', 'SocialSurveyId', 'EducationSurveyId',
                'LivelihoodSurveyId', 'NutritionSurveyId', 'EmpowermentSurveyId', 'ShelterSurveyId'
            ],
            include: [{
                model: Client,
                required: true,
                where: {
                     DisabilityType: { [Op.contains]: [disability] }
                },
                attributes: [
                    'ClientId', 'DisabilityType'
                ]
            }],
        }, {transaction});

        await transaction.commit();

        allStatsObj = await getAllStats(allSurveys);
        res.status(200).json(allStatsObj);

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(err);
        res.status(400).json(err);
    }
})

// @route   /surveyStats/location/disability
// @desc    GET all survey stats with a certain disability
router.get('/:loc/:disability', async (req,res) => {
    const location = req.params.loc;
    const disability = req.params.disability;

    let transaction;
    try {
        transaction = await sequelize.transaction();

        const allSurveys = await BaselineSurvey.findAndCountAll({
            attributes: [
                'HealthSurveyId', 'SocialSurveyId', 'EducationSurveyId',
                'LivelihoodSurveyId', 'NutritionSurveyId', 'EmpowermentSurveyId', 'ShelterSurveyId'
            ],
            include: [{
                model: Client,
                required: true,
                where: {
                    [Op.and]: [
                        { Location: location },
                        {
                          DisabilityType: { [Op.contains]: [disability] }
                        }
                    ]},
                attributes: [
                    'ClientId', 'Location', 'DisabilityType'
                ]
            }],
        }, {transaction});

        await transaction.commit();

        allStatsObj = await getAllStats(allSurveys);
        res.status(200).json(allStatsObj);

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router