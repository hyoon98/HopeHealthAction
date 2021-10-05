const express = require('express')
const router = express.Router()
const visit = require('../models/VisitForms/visit')
const worker = require('../models/worker')
const client = require('../models/client')
const healthForm = require('../models/VisitForms/healthForm')
const educationForm = require('../models/VisitForms/educationForm')
const socialForm = require('../models/VisitForms/socialForm')
const { MatchFilters, ValidateFilters } = require('./utils/FilterParsing')

const { sequelize } = require('../models/VisitForms/visit')
const { v4: uuidv4 } = require('uuid');

// @route   GET /visits/count?Location=["", ""]&Date=["", ""]&ClientId=1
// @desc    GET Retrieve the total number of visits per provided parameters
// @params  Optional: Location(s), Date, ClientId, WorkerId
router.get('/count', (req, res) => {
    let filters = { Location: [null], Date: [null], ClientId: null, WorkerId: null }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters);

    visit.count({
        where: filters
    })
        .then(visitCount => res.status(200).json(visitCount))
        .catch(err => res.status(400).json(err));
});

// @route   GET /visits/id
// @desc    GET Retrieve a visit with a certain id from the database
router.get('/:id', (req, res) => {
    const visitId = req.params.id
    visit.findAll({
        where: {
            VisitId: visitId
        },
        attributes: [
            'VisitPurpose', 'GPSLocation', 'Date',
            'Location', 'VillageNumber'
        ],
        include: [{
            model: client,
            required: true,
            attributes: [
                'ClientId', 'FirstName', 'LastName'
            ]
        },
        {
            model: worker,
            required: false,
            attributes: [
                'WorkerId', 'FirstName', 'LastName'
            ]
        },
        {
            model: healthForm,
            required: false

        },
        {
            model: educationForm,
            required: false
        },
        {
            model: socialForm,
            required: false
        }]
    })
        .then(visits => {
            res.json(visits);
        })
        .catch(err => res.status(404).json(err))

})

// @route   GET /visits/client/id
// @desc    GET Retrieve all visits for a specific client from the database ordered by date
router.get('/client/:id', (req, res) => {
    const clientId = req.params.id;

    visit.findAll({
        attributes: [
            'ClientId', 'VisitId', 'VisitPurpose', 'Date'
        ],
        where: {
            ClientId: clientId
        },
        order: [
            ['Date', 'DESC']
        ],
        include: [{
            model: worker,
            required: false,
            attributes: [
                'FirstName', 'LastName'
            ]
        }]
    })
        .then(visits => res.json(visits))
        .catch(err => res.status(404).json(err))
})

// @route   POST /visit/add
// @desc    POST Add a new visit to the database
router.post('/add', async (req, res) => {
    let { VisitPurpose, GPSLocation, Date,
        Location, VillageNumber, WorkerId, ClientId,
        HealthForm, EducationForm, SocialForm } = req.body;

    let transaction;

    try {
        transaction = await sequelize.transaction();

        if (HealthForm != null) {
            var HealthFormId = uuidv4();
            await healthForm.create({
                HealthFormId,
                Wheelchair: HealthForm.Wheelchair,
                Prosthetic: HealthForm.Prosthetic,
                Orthotic: HealthForm.Orthotic,
                WheelchairRepair: HealthForm.WheelchairRepair,
                HealthCenterReferral: HealthForm.HealthCenterReferral,
                Advice: HealthForm.Advice,
                Advocacy: HealthForm.Advocacy,
                Encouragement: HealthForm.Encouragement,
                GoalMet: HealthForm.GoalMet,
                ConcludedOutcome: HealthForm.ConcludedOutcome
            }, { transaction });
        }

        if (EducationForm != null) {
            var EducationFormId = uuidv4();
            await educationForm.create({
                EducationFormId,
                Advice: EducationForm.Advice,
                Advocacy: EducationForm.Advocacy,
                OrganizationReferral: EducationForm.OrganizationReferral,
                Encouragement: EducationForm.Encouragement,
                GoalMet: EducationForm.GoalMet,
                ConcludedOutcome: EducationForm.ConcludedOutcome
            }, { transaction });
        }

        if (SocialForm != null) {
            var SocialFormId = uuidv4();
            await socialForm.create({
                SocialFormId,
                Advice: SocialForm.Advice,
                Advocacy: SocialForm.Advocacy,
                OrganizationReferral: SocialForm.OrganizationReferral,
                Encouragement: SocialForm.Encouragement,
                GoalMet: SocialForm.GoalMet,
                ConcludedOutcome: SocialForm.ConcludedOutcome
            }, { transaction })
        }

        await visit.create({
            VisitPurpose,
            GPSLocation,
            Date,
            Location,
            VillageNumber,
            WorkerId,
            ClientId,
            HealthFormId,
            EducationFormId,
            SocialFormId
        }, { transaction });

        await transaction.commit();
        res.status(200).json("Visit Added Successfully")

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json(err);
    }

})

// @route   DELETE /visits/delete/id
// @desc    DELETE an existing visit in the database with matching id
router.delete('/delete/:id', async (req, res) => {
    let transaction;
    const visitId = req.params.id;

    try {
        transaction = await sequelize.transaction();

        const visitToDelete = await visit.findByPk(visitId, { transaction });

        if (visitToDelete === null) {
            throw new Error("Visit not found")
        }
        await visitToDelete.destroy({ transaction });
        await transaction.commit();
        res.json("Visit deleted successfully");
    }
    catch (err) {
        if (transaction)
            await transaction.rollback();
        if (err.message === "Visit not found")
            res.status(404).json(err.message)
        else
            res.status(400).json(err.name + ": " + err.message)
    }
})

// @route   GET /visits/count/zone
// @desc    GET Retrieve total CBR visits counts grouped by zone
router.get('/count/zone', (_, res) => {
    const aggCount = sequelize.fn('count', sequelize.col('Location'))

    visit.findAll({
        attributes: ['Location', [aggCount, 'count']],
        group: ['Location']
    })
    .then((count) => res.json(count))
    .catch((err) => res.status(404).json(err))
})

// @route   GET /visits/stats/location
// @desc    GET number of visits per location
router.get('/stats/location', async (req, res) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const stats = await visit.findAll({
            attributes: ['Location', [sequelize.fn('count', sequelize.col('Location')), 'count']],
            group: ['Location'],
            order: [[sequelize.literal('count'), 'DESC']]
        }, { transaction })

        await transaction.commit();
        res.json(stats);
    }
    catch (error) {
        if (transaction)
            await transaction.rollback();

        res.status(500).json(error);
    }
})

router.get('/stats/services', async (req, res) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();
        const visits = await visit.findAll({
            attributes: ['HealthFormId', 'EducationFormId', 'SocialFormId'],
            include: [{
                model: client,
                required: true,
                attributes: ['Location']
            }]
        }, { transaction });
        await transaction.commit();
        res.json(visits)
    }
    catch (error) {
        if (transaction)
            await transaction.rollback();

        res.status(500).json(error);
    }
})

module.exports = router