const express = require('express')
const router = express.Router()
const referral = require('../models/ReferralForms/referral')
const { sequelize } = require('../models/ReferralForms/referral')
const { MatchFilters, ValidateFilters } = require('./utils/FilterParsing');
const multer = require('multer');
const upload = multer({});

const worker = require('../models/worker')
const client = require('../models/client')

const wheelchairService = require('../models/ReferralForms/wheelchairService')
const physiotherapyService = require('../models/ReferralForms/physiotherapyService')
const prostheticService = require('../models/ReferralForms/prostheticService')
const orthoticService = require('../models/ReferralForms/orthoticService')

const { v4: uuidv4 } = require('uuid');

//Function that converts an image byte array into a base64 string
//Reference: https://robert-keller22.medium.com/upload-and-download-images-to-a-postgres-db-node-js-92e43f232ae4
function ConvertImage(referral){
    const targetImage = referral.Photo.toString('base64')
    referral['Photo'] = targetImage
}

// Used for statistics purposes of converting json object to array
// Note: The first attribute in the objects are the indices
function convertToArray(data, index) {
    let dataArr = [];
    for (var i in data) {
        data[i][index] = i;
        dataArr.push(data[i]);
    }

    return dataArr;
}

// @route   GET /referrals/outstanding
// @desc    GET all outstanding referrals (status === "Made") ordered by date
router.get('/outstanding', async (req, res) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        let referrals = await referral.findAll({
            where: {
                Status: "Made"
            },
            attributes: [
                "ReferralId", "Date", "ServiceRequired"
            ],
            order: [
                ['Date', 'ASC']
            ],
            include: [{
                model: client,
                required: true,
                attributes: [
                  'ClientId', 'FirstName', 'LastName'
                ]
            }]
        }, { transaction })
        
        await transaction.commit();
        res.status(200).json(referrals);
    }
    catch (error) {
        await transaction.rollback();
        res.status(500).json(error);
    }
})

// @route   GET /referrals/count?Location=["", ""]&Date=["", ""]&ClientId=1&ServiceRequired=["Physiotherapy"]
// @desc    GET Retrieve the total number of referrals per provided parameters
// @params  Optional: Date, ClientId, WorkerId, Status, ServiceRequired
router.get('/count', (req, res) => {
    let filters = { Date: [null], ClientId: null, WorkerId: null, Status: null, ServiceRequired: [null] }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters);

    referral.count({
        where: filters
    })
    .then(referralCount => res.status(200).json(referralCount))
    .catch(err => res.status(400).json(err));
});

// @route   GET /referrals/id
// @desc    GET Retrieve a referral with a certain id from the database
router.get('/:id', (req,res) => {
    const referralId = req.params.id;
    referral.findAll({
        where: {
            ReferralId: referralId
        },
        attributes: [
            'Date', 'ServiceRequired', 'OtherServices',
            'ReferTo', 'Status', 'Outcome'
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
            model: wheelchairService,
            required: false

        },
        {
            model: physiotherapyService,
            required: false
        },
        {
            model: prostheticService,
            required: false
        },
        {
            model: orthoticService,
            required: false
        }]
    })
    .then(referralsFound => {
        if(referralsFound[0].WheelchairService){
            ConvertImage(referralsFound[0].WheelchairService)
        }
        if(referralsFound[0].PhysiotherapyService){
            ConvertImage(referralsFound[0].PhysiotherapyService)
        }
        if(referralsFound[0].ProstheticService && referralsFound[0].ProstheticService.Photo){
            ConvertImage(referralsFound[0].ProstheticService)
        }
        if(referralsFound[0].OrthoticService && referralsFound[0].OrthoticService.Photo){
            ConvertImage(referralsFound[0].OrthoticService)
        }
        res.json(referralsFound);
    })
    .catch(err => {
        res.status(404).json(err);
    })

})

// @route   GET /referrals/client/id
// @desc    GET Retrieve all referrals for a specific client from the database ordered by date
router.get('/client/:id', (req, res) => {
    const clientId = req.params.id;
    referral.findAll({
        where: {
            ClientId: clientId
        },
        attributes: [
            'ReferralId', 'Date', 'ServiceRequired', 'OtherServices',
            'ReferTo', 'Status', 'Outcome'
        ],
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
    .then(referralsFound => {
        res.json(referralsFound);
    })
    .catch(err => {
        res.status(404).json(err);
    })

})

// @route   POST /referrals/add
// @desc    POST Add a new referral to the database
router.post('/add', upload.fields([{name: 'wheelchairPhoto', maxCount: 1}, 
{name: 'physioPhoto', maxCount: 1}, {name: 'prostheticPhoto', maxCount: 1}, 
{name: 'orthoticPhoto', maxCount: 1}]), async (req,res) => {
    let {Date, ServiceRequired, OtherServices,
        ReferTo, Status, Outcome, ClientId, WorkerId,
        WheelchairService, PhysiotherapyService,
        ProstheticService, OrthoticService} = req.body;

    // React formData sends a string instead of an array if only one service is selected
    if(typeof(ServiceRequired) === 'string'){
        ServiceRequired = [ServiceRequired]
    }

    // transaction functionality from
    // https://stackoverflow.com/questions/42870374/node-js-7-how-to-use-sequelize-transaction-with-async-await/49162797
    let transaction;
    try {
        transaction = await sequelize.transaction();


        if (WheelchairService != null) {
            WheelchairService = JSON.parse(WheelchairService)
            var WheelchairServiceId = uuidv4();
            await wheelchairService.create({
                WheelchairServiceId,
                Photo: req.files['wheelchairPhoto'][0].buffer,
                ClientProficiency: WheelchairService.ClientProficiency,
                ClientHipWidth: WheelchairService.ClientHipWidth,
                WheelchairExist: WheelchairService.WheelchairExist,
                WheelchairRepairable: WheelchairService.WheelchairRepairable
            }, { transaction });
        }

        if (PhysiotherapyService != null) {
            PhysiotherapyService = JSON.parse(PhysiotherapyService)
            var PhysiotherapyServiceId = uuidv4();
            await physiotherapyService.create({
                PhysiotherapyServiceId,
                Photo: req.files['physioPhoto'][0].buffer,
                ClientCondition: PhysiotherapyService.ClientCondition,
                OtherClientCondition: PhysiotherapyService.OtherClientCondition
            }, { transaction });
        }

        if (ProstheticService != null) {
            ProstheticService = JSON.parse(ProstheticService)
            var ProstheticServiceId = uuidv4();
            await prostheticService.create({
                ProstheticServiceId,
                Photo: req.files['prostheticPhoto'] ? req.files['prostheticPhoto'][0].buffer : null,
                InjuryPosition: ProstheticService.InjuryPosition
            }, { transaction });
        }

        if (OrthoticService != null) {
            OrthoticService = JSON.parse(OrthoticService)
            var OrthoticServiceId = uuidv4();
            await orthoticService.create({
                OrthoticServiceId,
                Photo: req.files['orthoticPhoto'] ? req.files['orthoticPhoto'][0].buffer : null,
                InjuryPosition: OrthoticService.InjuryPosition
            }, { transaction });
        }

        await referral.create({
            Date,
            ServiceRequired,
            OtherServices,
            ReferTo,
            Status,
            Outcome,
            ClientId,
            WorkerId,
            WheelchairServiceId,
            PhysiotherapyServiceId,
            ProstheticServiceId,
            OrthoticServiceId
        }, { transaction });

        await transaction.commit();
        res.status(200).json("Referral Added Successfully");
    }
    catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json(error);
    }

})

// @route   PUT /referrals/id/edit
// @desc    PUT newly update entries for referral with id in the database
router.put('/:id/edit', async (req,res) => {
    let {Date, ServiceRequired, OtherServices,
        ReferTo, Status, Outcome, ClientId, WorkerId,
        WheelchairService, PhysiotherapyService,
        ProstheticService, OrthoticService} = req.body;

    let transaction;
    const referralId = req.params.id;

    try {
        transaction = await sequelize.transaction();
        const referralToEdit = await referral.findByPk(referralId, { transaction });

        if (referralToEdit === null) {
            throw new Error("Referral not found")
        }

        if (WheelchairService != null) {
            await wheelchairService.update(referralToEdit.WheelchairServiceId, {
                ClientProficiency: WheelchairService.ClientProficiency,
                ClientHipWidth: WheelchairService.ClientHipWidth,
                WheelchairExist: WheelchairService.WheelchairExist,
                WheelchairRepairable: WheelchairService.WheelchairRepairable
            }, { transaction });

            if (typeof WheelchairService.Photo !== "undefined") {
                await wheelchairService.update(referralToEdit.WheelchairServiceId, {
                    Photo: WheelchairService.Photo.toString('base64')
                }, { transaction });
            }
        }

        if (PhysiotherapyService != null) {
            await physiotherapyService.update(referralToEdit.PhysiotherapyServiceId, {
                ClientCondition: PhysiotherapyService.ClientCondition,
                OtherClientCondition: PhysiotherapyService.OtherClientCondition
            }, { transaction });

            if (typeof PhysiotherapyService.Photo !== "undefined") {
                await physiotherapyService.update(referralToEdit.PhysiotherapyServiceId, {
                    Photo: PhysiotherapyService.Photo.toString('base64'),
                }, { transaction });
            }
        }

        if (ProstheticService != null) {
            await prostheticService.update(referralToEdit.ProstheticServiceId, {
                InjuryPosition: ProstheticService.InjuryPosition
            }, { transaction });

            if (typeof ProstheticService.Photo !== "undefined") {
                await prostheticService.update(referralToEdit.ProstheticServiceId, {
                    Photo: ProstheticService.Photo.toString('base64')
                }, { transaction });
            }
        }

        if (OrthoticService != null) {
            await orthoticService.update(referralToEdit.OrthoticServiceId, {
                InjuryPosition: OrthoticService.InjuryPosition
            }, { transaction });

            if (typeof WheelchairService.Photo !== "undefined") {
                await wheelchairService.update(referralToEdit.OrthoticServiceId, {
                    Photo: WheelchairService.Photo.toString('base64')
                }, { transaction });
            }
        }

        await referralToEdit.update({
            Date,
            ServiceRequired,
            OtherServices,
            ReferTo,
            Status,
            Outcome,
            ClientId,
            WorkerId
        }, { transaction });

        await transaction.commit();
        res.status(200).json("Referral updated Successfully");
    }
    catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        if (error.message === "Referral not found")
            res.status(404).json(error.message)
        else
            res.status(400).json(error);
    }
})

// @route   DELETE /referrals/delete/id
// @desc    DELETE existing referral in the database with matching id
router.delete('/delete/:id', async(req, res) => {
    let transaction;
    const referralId = req.params.id;

    try {
        transaction = await sequelize.transaction();

        const refToDelete = await referral.findByPk(referralId, { transaction });

        if (refToDelete === null) {
            throw new Error("Referral not found")
        }
        await refToDelete.destroy({ transaction });
        await transaction.commit();
        res.json("Referral deleted successfully");
    }
    catch (err) {
        if (transaction)
            await transaction.rollback();
        if (err.message === "Referral not found")
            res.status(404).json(err.message)
        else
            res.status(400).json(err.name + ": " + err.message)
    }
})

// @route   GET /referrals/stats/location
// @desc    GET number of referrals for each location (determined by client)
router.get('/stats/location', async (req, res) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const refs = await referral.findAll({
            attributes: ['Status'],
            include: [{
                model: client,
                required: true,
                attributes: ['Location']
            }]
        }, { transaction });

        // Generating statistics
        const data = {};
        refs.forEach((ref) => {
            if (!(ref.Client.Location in data)) {
                data[ref.Client.Location] = {Total: 0, Made: 0, Resolved: 0};
            }

            data[ref.Client.Location].Total += 1;    

            if (ref.Status === 'Made')
                data[ref.Client.Location].Made += 1;
            else
                data[ref.Client.Location].Resolved += 1;
        })

        // Need to convert to array to be used by the table / graph
        const stats = convertToArray(data, 'Location');

        await transaction.commit();
        res.json(stats);
    }
    catch (error) {
        if (transaction)
            await transaction.rollback();
        
        res.status(500).json(error);
    }
})

module.exports = router
