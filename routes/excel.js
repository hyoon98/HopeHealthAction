const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const excel = require('excel4node');
const client = require('../models/client');
const worker = require('../models/worker');
const BaselineSurvey = require('../models/BaselineSurveys/baselineSurvey');
const HealthSurvey = require('../models/BaselineSurveys/healthSurvey');
const EducationSurvey = require('../models/BaselineSurveys/educationSurvey');
const SocialSurvey = require('../models/BaselineSurveys/socialSurvey');
const NutritionSurvey = require('../models/BaselineSurveys/nutritionSurvey');
const ShelterSurvey = require('../models/BaselineSurveys/shelterSurvey');
const EmpowermentSurvey = require('../models/BaselineSurveys/empowermentSurvey');
const LivelihoodSurvey = require('../models/BaselineSurveys/livelihoodSurvey');
const visit = require('../models/VisitForms/visit')
const healthForm = require('../models/VisitForms/healthForm');
const educationForm = require('../models/VisitForms/educationForm');
const socialForm = require('../models/VisitForms/socialForm');
const { MatchFilters, ValidateFilters } = require('./utils/FilterParsing');


// @route   GET /excel
// @desc    GET all filtered clients in an excel format
router.get('/', async (req, res) => {
    // Get all filtered clients
    let filters = JSON.parse(req.query.filters);
    let sortBy = [[req.query.sortBy, "DESC"]];
    if (sortBy[0][0] === '') {
        sortBy = [];
    }

    let disabilitiesInSearch = filters.hasOwnProperty('DisabilityType');
    let nameInSearch = filters.hasOwnProperty('FirstName') || filters.hasOwnProperty('LastName');
    
    // date search filter
    let dateInSearch = filters.hasOwnProperty('DateCreated')
    if (dateInSearch) {
        let [dateFrom, dateTo] = filters['DateCreated']
        filters['DateCreated'] = {
            [Op.between]: [dateFrom, dateTo]
        }
    }

    let selectionClause;

    if (nameInSearch && disabilitiesInSearch) {
        selectionClause = {
            [Op.or]:
                [
                    {FirstName: {[Op.in]: [filters.FirstName, filters.LastName]}},
                    {LastName: {[Op.in]: [filters.FirstName, filters.LastName]}},
                    delete filters['FirstName'],
                    delete filters['LastName'],
                ],
            [Op.and]:
                [
                    {DisabilityType: {[Op.contains]: [filters.DisabilityType]}},
                    delete filters['DisabilityType'],
                    filters,

                ]
        }
    } else if (nameInSearch && !disabilitiesInSearch) {
        selectionClause = {
            [Op.or]:
                [
                    {FirstName: {[Op.in]: [filters.FirstName, filters.LastName]}},
                    {LastName: {[Op.in]: [filters.FirstName, filters.LastName]}},
                    delete filters['FirstName'],
                    delete filters['LastName'],
                ],
            [Op.and]: filters
        }
    } else if (!nameInSearch && disabilitiesInSearch) {
        selectionClause = {
            [Op.and]:
                [
                    {DisabilityType: {[Op.contains]: [filters.DisabilityType]}},
                    delete filters['DisabilityType'],
                    filters,
                ]
        }
    } else {
        selectionClause = filters;
    }

    try {
        let allClients = await client.findAll({
            // SELECT * FROM Clients WHERE FirstName IN filters.Name OR LastName IN filters.Name
            where: selectionClause,
            order: sortBy,
        });

        // Create Excel Workbook
        const wb = new excel.Workbook();
        let clientSheet = wb.addWorksheet('Clients');

        generateGenericWorkSheet(wb, clientSheet, allClients);
        wb.write('excel.xlsx', res);

    } catch(err) {
        console.error('[Error]: Could not generate client sheet successfully\n', err);
        res.status(400).json(err);
    }
})

// @route   GET /excel/baselineSurveys?Location=["", ""]&Date=["", ""]&ClientId=1&WorkerId
// @desc    GET all filtered clients in an excel format
// @params  Optional: Date, ClientId, WorkerId, Location
router.get('/baselineSurveys', async (req, res) => {
    let filters = { Date: [null], ClientId: null, WorkerId: null, Location: [null] }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters);

    // Separate locations from other filters
    let locations = { Location: filters.Location };
    delete filters.Location;
    if (locations.Location === undefined) {
        locations = {};
    }

    let surveys = await BaselineSurvey.findAll({
        where: filters,
        include:[
            {
                model: client,
                where: locations,
                required: true,
                attributes: [
                    'ClientId', 'FirstName', 'LastName', 'Location'
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
                model: HealthSurvey,
                required: false
            },
            {
                model: EducationSurvey,
                required: false
            },
            {
                model: SocialSurvey,
                required: false
            },
            {
                model: NutritionSurvey,
                required: false
            },
            {
                model: ShelterSurvey,
                required: false
            },
            {
                model: EmpowermentSurvey,
                required: false
            },
            {
                model: LivelihoodSurvey,
                required: false
            },
        ],

    })

    // Create Excel Workbook
    const wb = new excel.Workbook();
    let surveySheet = wb.addWorksheet('Baseline Surveys');
    try {
        generateGenericWorkSheet(wb, surveySheet, surveys);
        wb.write('excel.xlsx', res);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/visits', async (req, res) => {
    let filters = { Date: [null], ClientId: null, WorkerId: null, Location: [null] }
    MatchFilters(filters, req.query);
    filters = ValidateFilters(filters);

    let visits = await visit.findAll({
        where: filters,
        include:[
            {
                model: client,
                required: true,
                attributes: [
                    'ClientId', 'FirstName', 'LastName', 'Location'
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
            }
        ],
    });

    // Create Excel Workbook
    const wb = new excel.Workbook();
    let surveySheet = wb.addWorksheet('Baseline Surveys');
    try {
        generateGenericWorkSheet(wb, surveySheet, visits);
        wb.write('excel.xlsx', res);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Takes an Excel workbook and sheet then adds the data to the sheet.
// data must come from a database call
function generateGenericWorkSheet(workBook, workSheet, data) {
    if (data.length < 1) {
        throw new Error('Cannot generate worksheet from empty dataset.');
    }

    // Excel Sheet Headers
    let headerStyle = workBook.createStyle({
        font: {
            color: 'black',
            size: '14',
            bold: true,
            underline: true,
        },
        alignment: {
            horizontal: 'center',
        }
    })

    let cellStyle = workBook.createStyle({
        font: {
            color: 'black',
            size: '14',
        },
        alignment: {
            wrapText: false,
            horizontal: 'left',
        }
    })

    const attributes = data[0]._options.attributes;
    for (let i = 0; i < attributes.length - 1; i++) {
        workSheet.cell(1, i + 1)
            .string(attributes[i])
            .style(headerStyle)
        workSheet.column(i + 1).setWidth(18);
    }

    // Fill cells with data
    for (let i = 0; i < data.length; i++) {
        let j = 0;
        for (j; j < attributes.length; j++) {
            let currAttribute = attributes[j]
            let currValue = data[i].dataValues[currAttribute];

            switch (typeof(currValue)) {
                case 'number':
                    workSheet.cell(i + 2, j + 1)
                        .number(currValue)
                        .style(cellStyle)
                    break;
                case 'string':
                    workSheet.cell(i + 2, j + 1)
                        .string(currValue)
                        .style(cellStyle)
                    break;
                case 'object':
                    if (currAttribute === 'DateCreated') {
                        workSheet.cell(i + 2, j + 1)
                            .date(currValue).style({numberFormat: 'dd-mm-yyyy'})
                            .style(cellStyle)
                    } else if (currAttribute === 'DisabilityType') {
                        workSheet.cell(i + 2, j + 1)
                            .string(currValue)
                            .style(cellStyle)
                    }
                    break;
            }
        }
        try {
            // Fill in secondary data such as surveys or forms
            const formAttributes = data[i]._options.include;
            const formNames = data[i]._options.includeNames;
            const formData = data[i].dataValues;

            let colIndex = j;
            for (let k = 0; k < formNames.length; k++) {
                let currForm = formNames[k];
                for (let n = 0; n < formAttributes[k].attributes.length; n++) {
                    let currAttribute = formAttributes[k].attributes[n];
                    let currValue = formData[currForm].dataValues[currAttribute];

                    // write headers
                    workSheet.cell(1, n + colIndex + 1)
                        .string(currAttribute)
                        .style(headerStyle)
                    workSheet.column(n + colIndex + 1).setWidth(18);

                    switch (typeof(currValue)) {
                        case 'number':
                            workSheet.cell(i + 2, n + colIndex + 1)
                                .number(currValue)
                                .style(cellStyle)
                            break;
                        case 'string':
                            workSheet.cell(i + 2, n + colIndex + 1)
                                .string(currValue)
                                .style(cellStyle)
                            break;
                        case 'object':
                            if (currAttribute === 'DateCreated') {
                                workSheet.cell(i + 2, n + colIndex + 1)
                                    .date(currValue).style({numberFormat: 'dd-mm-yyyy'})
                                    .style(cellStyle)
                            } else if (currAttribute === 'DisabilityType') {
                                workSheet.cell(i + 2, n + colIndex + 1)
                                    .string(currValue)
                                    .style(cellStyle)
                            } else if (currAttribute === 'AssistiveDeviceRequired' || currAttribute === 'DisabilityOrganizations') {
                                let list = '';
                                for (let iter = 0; iter < currValue.length; iter++) {
                                    if (iter > 0) {
                                        list = list.concat(",");
                                    }
                                    list = list.concat(currValue[iter]);
                                }
                                workSheet.cell(i + 2, n + colIndex + 1)
                                    .string(list)
                                    .style(cellStyle)
                            }
                            break;
                        case 'boolean':
                            workSheet.cell(i + 2, n + colIndex + 1)
                                .bool(currValue)
                                .style(cellStyle)
                    }

                }
                colIndex += formAttributes[k].attributes.length;
            }
        } catch (error) {
            console.log("Data does not have secondary forms");
        }
    }
}

module.exports = router;