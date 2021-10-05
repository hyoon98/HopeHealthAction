const express = require('express')
const router = express.Router()
const client = require('../models/client')
const multer = require('multer');
const { sequelize } = require('../models/client');
const BaselineSurvey = require('../models/BaselineSurveys/baselineSurvey');
const { MatchFilters, ValidateFilters } = require('./utils/FilterParsing');
const upload = multer({});

//Function that converts an image byte array into a base64 string
//Reference: https://robert-keller22.medium.com/upload-and-download-images-to-a-postgres-db-node-js-92e43f232ae4
function ConvertImage(client){
    const clientImage = client.Photo.toString('base64')
    client['Photo'] = clientImage
}

// @route   GET /clients/priority(?loc=<location>?num=<Number of clients>)
// @desc    GET all clients sorted by priority
// Optional Parameters: location and num clients
router.get('/priority/:loc&:num', async (req, res) => {
    const location = req.params.loc;
    const numClients = req.params.num;

    try {
        await sequelize.transaction(async (transaction) => {

            await client.findAll({
                attributes: {
                    exclude: [
                        'HealthDesc',
                        'HealthGoal',
                        'EducationDesc',
                        'EducationGoal',
                        'SocialDesc',
                        'SocialGoal'
                    ]
                },
                where: {Location: location},
                order: [['Priority', 'DESC']],
                limit: numClients,
            }, {transaction})
                .then(clients => {
                    clients.map(ConvertImage)
                    return clients;
                })
                .then(clients => {
                    res.json(clients)
                })
                .catch(err => res.status(404).json(err))
        })
    } catch(error) {
        res.status(500).json(error);
    }
})

// @route   GET /clients/count?Location=["", ""]&Date=["", ""]
// @desc    GET Retrieve the total number of clients per provided parameters
// @params  Optional: Location(s), Date, Disabilities
router.get('/count', (req, res) => {
    let filters = { Location: [null], Date: [null], DisabilityType: [null] }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters)

    client.count({
        where: filters
    })
        .then(clientCount => res.status(200).json(clientCount))
        .catch(err => res.status(400).json(err));
})

// @route   GET /clients/id
// @desc    GET Retrieve a client with a certain id from the database
router.get('/:id', (req,res) => {
    const clientId = req.params.id
    client.findOne({
        where: {
            ClientId: clientId
        },
        include: [{
            model: BaselineSurvey,
            required: false
        }]
    })
    .then(client => {
        ConvertImage(client)
        return client;
    })
    .then(client => res.json(client))
    .catch(err => res.status(404).json(err))
})

// @route   GET /clients
// @desc    Get All clients
router.get('/', (req, res) => 
    client.findAll()
    .then(clients => {
        clients.map(client => ConvertImage(client))
        return clients;
    })
    .then(clients => res.json(clients))
    .catch(err => res.status(404).json(err))   
)

// @route   POST /clients/add
// @desc    POST Add a new client to the database
router.post('/add', upload.single('Photo'), (req,res) => {
    let {FirstName, LastName, Gender, Location, ContactNo, 
        VillageNumber, Age, DisabilityType, GPSLocation, Consent,
        CaregiverState, CaregiverContactNo, HealthStatus, HealthDesc,
        HealthGoal, EducationStatus, EducationDesc, EducationGoal,
        SocialStatus, SocialDesc, SocialGoal, CaregiverName, WorkerId, DateCreated} = req.body;

    client.create({
        FirstName,
        LastName,
        Gender,
        Location,
        ContactNo,
        VillageNumber,
        Age,
        DateCreated,
        DisabilityType: DisabilityType.split(", "),
        Photo: req.file.buffer,
        GPSLocation,
        Consent,
        CaregiverName,
        CaregiverState,
        CaregiverContactNo,
        HealthStatus,
        HealthDesc,
        HealthGoal,
        EducationStatus,
        EducationDesc,
        EducationGoal,
        SocialStatus,
        SocialDesc,
        SocialGoal,
        WorkerId
    })
    .then(() => {
        res.send("Client Added Successfully")
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// @route   GET /clients/location/location_name
// @desc    GET Retrieve all clients residing in a specific location
router.get('/location/:loc', (req,res) => {
    const location = req.params.loc
    
    client.findAll({
        attributes: {
            exclude: [
                'HealthDesc', 
                'HealthGoal',
                'EducationDesc',
                'EducationGoal',
                'SocialDesc',
                'SocialGoal'
            ]
        },
        where: {
            Location: location
        }
    })
    .then(clients => {
        clients.map(client => ConvertImage(client))
        return clients;
    })
    .then(clients => res.json(clients))
    .catch(err => {
        console.log(err);
        res.status(404).json(err)
    })  
})

// @route   PUT /clients/id/edit
// @desc    PUT the newly modified entries for client with id in database
router.put('/:id/edit', upload.single('Photo'), async (req, res) => {

    let {FirstName, LastName, Gender, Location, ContactNo, 
        VillageNumber, Age, DisabilityType, GPSLocation, Consent,
        CaregiverState, CaregiverContactNo, HealthStatus, HealthDesc,
        HealthGoal, EducationStatus, EducationDesc, EducationGoal,
        SocialStatus, SocialDesc, SocialGoal, WorkerId, DeletePhoto} = req.body;

    const clientId = req.params.id

    try {
        // Reference: https://sequelize.org/master/manual/transactions.html
        await sequelize.transaction( async (t) => {
            const clientToEdit = await client.findByPk(clientId, {transaction: t})

            if (clientToEdit === null) {
                throw new Error("Client not found")
            }

            await clientToEdit.update({
                FirstName,
                LastName,
                Gender,
                Location,
                ContactNo,
                VillageNumber,
                Age,
                DisabilityType: DisabilityType.split(", "),
                GPSLocation,
                Consent,
                CaregiverState,
                CaregiverContactNo,
                HealthStatus,
                HealthDesc,
                HealthGoal,
                EducationStatus,
                EducationDesc,
                EducationGoal,
                SocialStatus,
                SocialDesc,
                SocialGoal,
                WorkerId
            }, {transaction: t})
    
            if (typeof req.file !== 'undefined') {
                await clientToEdit.update({
                    Photo: req.file.buffer
                }, {transaction: t})
            }
            else if (DeletePhoto === "Y") {
                await clientToEdit.update({
                    Photo: []
                }, {transaction: t})
            }
            res.status(200).json("Client updated successfully")   
        })
    } 

    catch (err) {
        if (err.message === "Client not found")
            res.status(404).json(err.message)
        else
            res.status(400).json(err.name + ": " + err.message)
    }
})

router.delete('/delete/:id', async(req, res) => {
    let transaction;
    const clientId = req.params.id;

    try {
        transaction = await sequelize.transaction();

        const clientToDelete = await client.findByPk(clientId, { transaction });

        if (clientToDelete === null) {
            throw new Error("Client not found")
        }
        await clientToDelete.destroy({ transaction });
        await transaction.commit();
        res.json("Client deleted successfully");
    }
    catch (err) {
        if (transaction)
            await transaction.rollback();
        if (err.message === "Client not found")
            res.status(404).json(err.message)
        else
            res.status(400).json(err.name + ": " + err.message)
    }
})


module.exports = router
