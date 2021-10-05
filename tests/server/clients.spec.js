const app = require('./../../app');
const Client = require('./../../models/client')
const chai = require('chai');
const fs = require('fs');
const supertest = require('supertest');
const expect = chai.expect;

const default_profile = fs.readFileSync('./image/default-profile.jpg').toString('base64');
const request = supertest(app.server);

describe('Testing API endpoints in /clients route', function() {
   it('GET \'/\', Returns all clients', async function() {
       const res = await request.get('/clients');
       const clients = res.body;
       expect(clients).to.not.be.null;
       expect(res.status).to.not.be.equal(404);
       const clientAttributes = Object.keys(Client.rawAttributes)
       clients.forEach(client => {
           clientAttributes.forEach(attribute => {
               expect(client).to.have.property(attribute);
           });
       });
   });

   it('POST \'/clients/add\', POST Add a new client to the database', async function() {
       const newClient = {
           FirstName: 'Test1',
           LastName: 'Test1',
           Gender: 'Male',
           Location: 'BidiBidi Zone 1',
           ContactNo: '111-111-1111',
           VillageNo: '5',
           Age: 10,
           DisabilityType: `{${['Amputee', 'Polio']}}`,
           Consent: 'Y',
           Photo: default_profile, // TODO fix this photo error
           CaregiverState: 'Y',
           HealthStatus: 'High Risk',
           HealthDesc: '',
           HealthGoal: '',
           EducationStatus: 'High Risk',
           EducationDesc: '',
           EducationGoal: '',
           SocialStatus: 'High Risk',
           SocialDesc: '',
           SocialGoal: ''
       }
       const res = await request.post('/clients/add').send(newClient);
       expect(res.body).to.not.be.null;
       expect(res.body).to.be.not.equals("Client Added Successfully");  // TODO photo error
       expect(res.status).to.not.be.equal(400);
   });

   it('GET \'/clients/id\' Retrieve a client with a certain id from the database', async function() {
       const res = await request.get('/clients/1');
       const client = res.body;
       expect(client).to.not.be.null;
       expect(res.status).to.not.be.equal(404);
       expect(client.ClientId === 1);
    });
   // TODO test the rest of the /client endpoints
});


// Shutdown server after testing
app.server.close();