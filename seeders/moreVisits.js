'use strict';
const faker = require('faker');
const fs = require('fs');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SeedInterface = require('./utils/SeedMoreVisits');

const locations = ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
  'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'];
const num_villages = 6;
const default_profile = fs.readFileSync('./image/default-profile.jpg');

const workers = ['7b2aff58-60fb-4f42-aa3b-21760ed4c134', '53e996ff-6c85-4e3e-b7c8-ff31edd93239'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let seedVisits = [
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: uuid.v4(),
      Wheelchair: 'Wheelchair was provided.',
      Advice: 'Focus on getting around on your own.',
      Encouragement: 'He is excited to get comfortable with his wheelchair',
      GoalMet: 'Concluded',
      ConcludedOutcome: 'Acquired Wheelchair',
    },
    EducationForm: {
      EducationFormId: null,
    },
    SocialForm: {
      SocialFormId: null,
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: uuid.v4(),
      Wheelchair: 'Wheelchair was provided.',
      Advice: 'Focus on getting around on your own.',
      Encouragement: 'He is excited to get comfortable with his wheelchair',
      GoalMet: 'Concluded',
      ConcludedOutcome: 'Acquired Wheelchair',
    },
    EducationForm: {
      EducationFormId: null,
    },
    SocialForm: {
      SocialFormId: null,
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: uuid.v4(),
      Advice: 'Still no appointment',
      GoalMet: 'Ongoing',
    },
    EducationForm: {
      EducationFormId: uuid.v4(),
      GoalMet: 'Concluded',
      ConcludedOutcome: 'Found a tutor and they are doing better!',
    },
    SocialForm: {
      SocialFormId: null,
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: uuid.v4(),
      GoalMet: 'Concluded',
      HealthCenterReferral: 'Optometrist appointment',
      ConcludedOutcome: 'She requires some glasses that have been ordered',
    },
    EducationForm: {
      EducationFormId: null,
    },
    SocialForm: {
      SocialFormId: uuid.v4(),
      GoalMet: 'Canceled',
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: null,
    },
    EducationForm: {
      EducationFormId: null,
    },
    SocialForm: {
      SocialFormId: uuid.v4(),
      Advice: 'Get out more.',
      Encouragement: 'You will be more mobile again soon.',
      GoalMet: 'Ongoing',
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: uuid.v4(),
      Orthotic: 'We will create a referral for you for some orthotic exercises.',
      Encouragement: 'You are doing great!',
      GoalMet: 'Ongoing',
    },
    EducationForm: {
      EducationFormId: uuid.v4(),
      Advocacy: 'Reached out to neighbor for help getting to school.',
      GoalMet: 'Ongoing',
    },
    SocialForm: {
      SocialFormId: null
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: null
    },
    EducationForm: {
      EducationFormId: uuid.v4(),
      Advocacy: 'Doing much better',
      GoalMet: 'Concluded',
      ConcludedOutcome: 'Catch up on learning.'
    },
    SocialForm: {
      SocialFormId: uuid.v4(),
      GoalMet: 'Canceled',
    },
  },
  {
    VisitId: uuid.v4(),
    ClientId: randomInt(1, 4),
    WorkerId: workers[randomInt(1,2)],
    VisitPurpose: 'CBR',
    GPSLocation: 0,
    Date: faker.date.recent(),
    Location: locations[randomInt(1, locations.length)],
    VillageNumber: randomInt(1, num_villages),
    HealthForm: {
      HealthFormId: null
    },
    EducationForm: {
      EducationFormId: null
    },
    SocialForm: {
      SocialFormId: uuid.v4(),
      GoalMet: 'Canceled',
    },
  },
];

const results = SeedInterface(seedVisits);
module.exports = results;