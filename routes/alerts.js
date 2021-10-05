const express = require('express')
const router = express.Router()
const alert = require('../models/alert')
const worker = require('../models/worker')
const { Op } = require('sequelize')
const {sequelize} = require('../models/alert')

// @route   GET /alerts/id
// @desc    GET Retrieve an alert by id
router.get('/:id', async (req, res) => {
    const alertId = req.params.id

    let transaction

    try {
        transaction = await sequelize.transaction()

        let result = await alert.findByPk(alertId, { transaction })

        if(result === null) {
            throw new Error("Alert not found") 
        }

        await transaction.commit()
        res.status(200).json(result)
        
    } catch (error) {
        await transaction.rollback();
        if(error.message === "Alert not found") {
            res.status(404).json(error.message)
        }
        else {
            res.status(400).json(error.message)
        }
    }
})

// @route   GET /alerts
// @desc    GET Retrieve all alerts
router.get('/', async (req, res) => {

    let transaction

    try {
        transaction = await sequelize.transaction()

        let result = await alert.findAll({
            order: [
                ['Date', 'DESC'],
                ['AlertId', 'DESC']
            ]}, { transaction })

        if(result === null) {
            throw new Error("No Alerts found")
        }

        await transaction.commit()
        res.status(200).json(result)

    } catch (error) {
        await transaction.rollback();
        if(error.message === "No Alerts found") {
            res.status(404).json(error.message)
        }
        else {
            res.status(400).json(error.message)
        }
    }
})

// @route   GET /alerts/worker/id
// @desc    GET Retrieve all alerts for a specific cbr worker
router.get('/worker/:id', async (req, res) => {
    const workerId = req.params.id

    let transaction

    try {
        transaction = await sequelize.transaction()

        let isWorker = await worker.findByPk(workerId, { transaction })

        if(isWorker === null) {
            throw new Error("Worker not found") 
        }
        else{
            let result = await alert.findAll({
                attributes: [
                    'AlertId',
                    'Title',
                    'Message',
                    'Date',
                    'AuthorUsername',
                    'ForAllWorkers'
                ],
                where: {
                    [Op.or]: [
                        { ForAllWorkers: true },
                        { 
                          SpecificWorkers: {
                            [Op.contains]: [workerId]
                          } 
                        }
                    ]
                },
                order: [
                    ['Date', 'DESC'],
                    ['AlertId', 'DESC']
                ]
            }, { transaction })
    
            await transaction.commit()
            res.status(200).json(result)
        }
    } 
    catch (error) {
        await transaction.rollback()
        if(error.message === "Worker not found") {
            res.status(404).json(error.message)
        }
        else {
            res.status(400).json(error.message)
        }
    }

})


// @route   POST /alerts/add
// @desc    POST Add a new alert to the database
router.post('/add', async (req, res) => {
    let { Title, Message, SpecificWorkers,
          ForAllWorkers, AuthorUsername} = req.body

    let transaction

    try {
        transaction = await sequelize.transaction();

        await alert.create({
            Title,
            Message,
            SpecificWorkers,
            AuthorUsername,
            ForAllWorkers
        }, { transaction });

        await transaction.commit();
        res.status(201).json("Alert Added Successfully");
    }
    catch(error) {
        await transaction.rollback();
        res.status(400).json(error);
    }
})

// @route   DELETE /alerts/:id/delete
// @desc    DELETE an existing alert in the database
router.delete('/:id/delete', async (req, res) => {
    let alertId = req.params.id

    let transaction

    try {
        transaction = await sequelize.transaction()

        let alertToDelete = await alert.findByPk(alertId, { transaction })

        if (alertToDelete === null)
            throw new Error("Alert not found")
        
        await alertToDelete.destroy({ transaction })

        await transaction.commit()
        res.json("Alert deleted")
    }
    catch (error) {
        if (transaction)
            await transaction.rollback()
        
        if (error.message === "Alert not found")
            res.status(404).json(error.message)
        else
            res.status(400).json(error)
    }
})

module.exports = router
