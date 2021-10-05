const app = require('./../../app');
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const request = supertest(app.server);

describe('Testing API endpoints in /baselineSurveys route', function() {
    it('POST \'/baselineSurveys/add\', Add a new baselineSurvey to the database and return status 200', async function() {
        const newBaselineSurvey = {
            "WorkerId": "7b2aff58-60fb-4f42-aa3b-21760ed4c134",
            "ClientId": 1,
            "socialSurvey": {
            "ValuedCommunityMember": false,
                "Independence": false,
                "CommunityParticipation": true,
                "Discrimination": false
            },
            "shelterSurvey": {
            "ShelterAccess": false,
                "EssentialsAccess": false
            },
            "nutritionSurvey": {
            "FoodStatus": "Poor",
                "MonthlyFoodAccess": false,
                "ChildNutritionStatus": "Malnourished",
            },
            "livelihoodSurvey": {
            "WorkStatus": false,
                "WorkDescription": false,
                "EmploymentType": "Employed",
                "FinancialNeedsMet": false,
                "DisabilityImpact": false,
                "WorkWanted": false
            },
            "empowermentSurvey": {
            "DisabilityOrganizationMember": false,
                "DisabilityOrganizations": ["No"],
                "EmploymentType": "Employed",
                "AwareDisabilityRights": false,
                "Influential": false
            },
            "educationSurvey": {
            "SchoolState": false,
                "CurrentGrade": "10",
                "NoSchoolReason": "Lack of Funding",
                "SchoolBefore": false,
                "WantSchool": false
            },
            "healthSurvey": {
            "HealthStatus": "Very Poor",
                "RehabilitationAccess": false,
                "RehabilitationAccessNeeded": true,
                "AssistiveDevice": false,
                "AssistiveDeviceWorking": false,
                "AssistiveDeviceNeeded": false,
                "AssistiveDeviceRequired": ["Wheelchair", "Prosthetic"],
                "HealthServiceStatus": "Fine"
            }
        }

        const res = await request.post('/baselineSurveys/add').set("content-type", "application/raw").send(JSON.stringify(newBaselineSurvey));
        expect(res.body).to.not.be.null;
        expect(res.body).to.be.equals("New Baseline Survey added");
        expect(res.status).to.not.be.equal(400);
        expect(res.status).to.be.equal(200);
    });
})

app.server.close();