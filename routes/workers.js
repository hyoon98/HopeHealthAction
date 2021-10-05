const express = require('express')
const router = express.Router()
const worker = require('../models/worker')
const visit = require('../models/VisitForms/visit')
const referral = require('../models/ReferralForms/referral')
const Client = require('../models/client')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const { MatchFilters, ValidateFilters } = require('./utils/FilterParsing')

function TotalCount(model, workerId) {
    return model.count({
            col: 'WorkerId',
            where: {
                WorkerId: workerId
            }
        })
}

function WeeklyCount(model, workerId) {
    let fromDate = new Date()
    fromDate.setHours(0,0,0,0)

    let toDate = new Date()
    toDate.setHours(0,0,0,0)

    return model.count({
        col: 'WorkerId',
        where: {
            WorkerId: workerId,
            Date: {
                [Op.between]: [fromDate - ((24 * 60 * 60 * 1000) * 7), toDate]
            }
        }
    })
}

function visitsAndReferralsPerformance(model, modelId, groupedCol, order) {
    return model.findAll({
        attributes: [
            'WorkerId',
            [Sequelize.fn('COUNT', Sequelize.col(modelId)), 'statcount']
        ],
        group: [groupedCol, 'Worker.WorkerId'],
        order: [
            [Sequelize.literal('statcount'), order]
        ],
        include: [{
            model: worker,
            required: true,
            attributes: [
                "FirstName", 
                "LastName"
            ],
        }],
        limit: 5
    })
}

// @route   GET /workers
// @desc    GET Retrieve all workers from the database
router.get('/', (req,res) => {
    worker.findAll({
        attributes: {
            exclude: ['Photo']
        }
    })
    .then(workers => res.json(workers))
    .catch(err => res.status(404).json(err))
})

// @route   GET /workers/id/visits
// @desc    GET Retrieve all visits done by a worker from the database
router.get('/:id/visits', (req,res) => {
    const workerId = req.params.id;

    visit.findAll({
        attributes: [
            'ClientId',
            'VisitId', 
            'VisitPurpose', 
            'Date'
        ],
        where: {
            WorkerId: workerId
        },
        include: [{
            model: Client,
            required: true,
            attributes: [
                "FirstName", "LastName"
            ]
        }],
        order: [
            ['Date', 'DESC']
        ]
    })
    .then(visits => res.json(visits))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/id/referrals
// @desc    GET Retrieve all referrals performed by a worker from the database
router.get('/:id/referrals', (req,res) => {
    const workerId = req.params.id;

    referral.findAll({
        attributes: [
            'ReferralId', 
            'ClientId', 
            'Date', 
            'Status', 
            'Outcome'
        ],
        where: {
            WorkerId: workerId
        },
        include: [{
            model: Client,
            required: true,
            attributes: [
                "FirstName", "LastName"
            ]
        }],
        order: [
            ['Date', 'DESC']
        ]
    })
    .then(referrals => res.json(referrals))
    .catch(err => res.status(400).json(err))
})
// @route   GET /workers/workerId/clients/count
// @desc    GET Retrieve the number of all clients created by a worker
router.get('/:id/clients/count', (req, res) => {
    const workerId = req.params.id

    TotalCount(Client, workerId)
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))

})

// @route   GET /workers/workerId/clients/weeklyCount
// @desc    GET Retrieve the number of all clients created by a worker in the past week
router.get('/:id/clients/weeklyCount', (req, res) => {
    const workerId = req.params.id

    let fromDate = new Date()
    fromDate.setHours(0,0,0,0)

    let toDate = new Date()
    toDate.setHours(0,0,0,0)

    Client.count({
        col: 'WorkerId',
        where: {
            WorkerId: workerId,
            DateCreated: {
                [Op.between]: [fromDate - ((24 * 60 * 60 * 1000) * 7), toDate]
            }
        }
    })
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/visits/count
// @desc    GET Retrieve the number of all visits created by a worker
router.get('/:id/visits/count', (req, res) => {
    const workerId = req.params.id

    TotalCount(visit, workerId)
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/visits/weeklyCount
// @desc    GET Retrieve the number of all visits created by a worker in the past week
router.get('/:id/visits/weeklyCount', (req, res) => {
    const workerId = req.params.id

    WeeklyCount(visit, workerId)
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/referrals/count
// @desc    GET Retrieve the number of all referrals created by a worker
router.get('/:id/referrals/count', (req, res) => {
    const workerId = req.params.id

    TotalCount(referral, workerId)
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/referrals/weeklyCount
// @desc    GET Retrieve the number of all referrals created by a worker in the past week
router.get('/:id/referrals/weeklyCount', (req, res) => {
    const workerId = req.params.id

    WeeklyCount(referral, workerId)
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/referrals/resolved/count
// @desc    GET Retrieve the number of all referrals resolved by a worker
router.get('/:id/referrals/resolved/count', (req, res) => {
    const workerId = req.params.id

    referral.count({
        col: 'WorkerId',
        where: {
            WorkerId: workerId,
            Status: 'Resolved'
        }
    })
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/workerId/referrals/resolved/weeklyCount
// @desc    GET Retrieve the number of all referrals resolved by a worker in the past week
router.get('/:id/referrals/resolved/weeklyCount', (req, res) => {
    const workerId = req.params.id

    let fromDate = new Date()
    fromDate.setHours(0,0,0,0)

    let toDate = new Date()
    toDate.setHours(0,0,0,0)

    referral.count({
        col: 'WorkerId',
        where: {
            WorkerId: workerId,
            Status: 'Resolved',
            Date: {
                [Op.between]: [fromDate - ((24 * 60 * 60 * 1000) * 7), toDate]
            }
        }
    })
    .then(count => res.json(count))
    .catch(err => res.status(400).json(err))
})

// @route   GET /workers/count?Location=["", ""]
// @desc    GET Retrieve the total number of workers per provided parameters
// @params  Location(s) // if multiple locations format ?location=["location 1", "location 2"]
router.get('/count', (req, res) => {
    let filters = { Location: [null] }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters)

    worker.count({
        where: filters
    })
    .then(workerCount => res.status(200).json(workerCount))
    .catch(err => res.status(400).json(err));
})

// @route   GET /workers/mostVisits
// @desc    GET Retrieve the top 5 CBR workers performing the most number of visits
router.get('/mostVisits', (req, res) => {
    
    visitsAndReferralsPerformance(visit, 'VisitId', 'Visit.WorkerId', 'DESC')
    .then(workers => res.json(workers))
    .catch(err => res.status(500).json(err))
})

// @route   GET /workers/leastVisits
// @desc    GET Retrieve the top 5 CBR workers performing the least number of visits
router.get('/leastVisits', (req, res) => {

    visitsAndReferralsPerformance(visit, 'VisitId', 'Visit.WorkerId', 'ASC')
    .then(workers => res.json(workers))
    .catch(err => res.status(500).json(err))
})

// @route   GET /workers/mostReferrals
// @desc    GET Retrieve the top 5 CBR workers performing the most numbers of referrals
router.get('/mostReferrals', (req, res) => {
    
    visitsAndReferralsPerformance(referral, 'ReferralId', 'Referral.WorkerId', 'DESC')
    .then(workers => res.json(workers))
    .catch(err => res.status(500).json(err))
})

// @route   GET /workers/leastReferrals
// @desc    GET Retrieve the top 5 CBR workers performing the least number of referrals
router.get('/leastReferrals', (req, res) => {
    
    visitsAndReferralsPerformance(referral, 'ReferralId', 'Referral.WorkerId', 'ASC')
    .then(workers => res.json(workers))
    .catch(err => res.status(500).json(err))
})

module.exports = router
