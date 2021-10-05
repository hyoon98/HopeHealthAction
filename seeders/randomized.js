'use strict';
const faker = require('faker');
const fs = require('fs');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SeedInterface = require('./utils/SeedInterface')

const disabilities = ['Amputee', 'Polio', 'Spinal Cord Injury', 'Cerebral Palsy', 'Spina Bifida', 'Hydrocephalus', 'Visual Impairment',
  'Hearing Impairment', 'Don\'t Know', 'Other'];
const locations = ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
  'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'];
const statuses = ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'];
const num_villages = 6;
const genders = ['Male', 'Female'];   // Please don't hurt me, its just for testing
const referral_status = ['Made', 'Resolved'];
const goal_status = ['Canceled', 'Ongoing', 'Concluded'];
const prosthetic_injury = ['Above knee', 'Below knee'];
const orthotic_injury = ['Above elbow', 'Below elbow'];
const client_proficiency = ['Basic', 'Intermediate'];
const service_required = ['Physiotherapy', 'Prosthetic', 'Orthotic', 'Wheelchair', 'Other'];

const default_profile = fs.readFileSync('./image/default-profile.jpg');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// These are set instead of generated for easy Postman Testing
const worker1_uuidv4 = '7b2aff58-60fb-4f42-aa3b-21760ed4c134';
const worker2_uuidv4 = '53e996ff-6c85-4e3e-b7c8-ff31edd93239';
const admin_uuidv4 = 'd6ef8378-3956-403a-ac4b-50a714c742a0';

const defaultPassword = bcrypt.hashSync('123456', 10);

let seedWorkers = [
  {
    Worker: {
      WorkerId: worker1_uuidv4,
      FirstName: 'Worker1',
      LastName: 'One',
      Photo: '',
      Location: locations[0],
    },
    User:{
      WorkerId: worker1_uuidv4,
      Username: 'worker1',
      Password: defaultPassword,
      Role: 'Worker'
    }
  },
  {
    Worker: {
      WorkerId: worker2_uuidv4,
      FirstName: 'Worker2',
      LastName: 'Two',
      Photo: '',
      Location: locations[6],},
    User: {
      WorkerId: worker2_uuidv4,
      Username: 'worker2',
      Password: defaultPassword,
      Role: 'Worker'
    }
  },
  {
    Worker: {
      WorkerId: admin_uuidv4,
      FirstName: 'Admin',
      LastName: 'One',
      Photo: '',
      Location: locations[5],
    },
    User: {
      WorkerId: admin_uuidv4,
      Username: 'admin',
      Password: defaultPassword,
      Role: 'Admin'
    }
  },
  // Add new Workers here
]

let seedClients = [
  {
    Client: {
      ClientId: randomInt(0, 100000),
      WorkerId: worker1_uuidv4,
      FirstName: faker.name.firstName(),
      LastName:  faker.name.lastName(),
      DateCreated: faker.date.recent(),
      Gender: genders[randomInt(0,2)],
      Location: locations[randomInt(0, locations.length)],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: randomInt(1, 80),
      DisabilityType: `{${disabilities[randomInt(0, disabilities.length)]}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: statuses[randomInt(0, statuses.length)],
      HealthDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      HealthGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationStatus: statuses[randomInt(0, statuses.length)],
      EducationDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: statuses[randomInt(0, statuses.length)],
      SocialDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      SocialGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Encouragement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location:locations[randomInt(0, locations.length)],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
    ],
    Referrals: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        PhysiotherapyService: {
          PhysiotherapyServiceId: uuid.v4(),
          Photo: default_profile,
          ClientCondition: null,
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: prosthetic_injury[randomInt(0,1)],
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: orthotic_injury[randomInt(0,1)],
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: client_proficiency[randomInt(0,1)],
          ClientHipWidth: randomInt(4, 100),
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${service_required[randomInt(0, service_required.length)]}}`,
        ReferTo: 'Disability Center',
        Status: referral_status[randomInt(0, 1)],
        Outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
  },

  {
    Client: {
      ClientId: randomInt(0, 100000),
      WorkerId: worker1_uuidv4,
      FirstName: faker.name.firstName(),
      LastName:  faker.name.lastName(),
      DateCreated: faker.date.recent(),
      Gender: genders[randomInt(0,2)],
      Location: locations[randomInt(0, locations.length)],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: randomInt(1, 80),
      DisabilityType: `{${disabilities[randomInt(0, disabilities.length)]}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: statuses[randomInt(0, statuses.length)],
      HealthDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      HealthGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationStatus: statuses[randomInt(0, statuses.length)],
      EducationDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: statuses[randomInt(0, statuses.length)],
      SocialDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      SocialGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Encouragement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location:locations[randomInt(0, locations.length)],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
    ],
    Referrals: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        PhysiotherapyService: {
          PhysiotherapyServiceId: uuid.v4(),
          Photo: default_profile,
          ClientCondition: null,
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: prosthetic_injury[randomInt(0,1)],
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: orthotic_injury[randomInt(0,1)],
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: client_proficiency[randomInt(0,1)],
          ClientHipWidth: randomInt(4, 100),
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${service_required[randomInt(0, service_required.length)]}}`,
        ReferTo: 'Disability Center',
        Status: referral_status[randomInt(0, 1)],
        Outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
  },

  {
    Client: {
      ClientId: randomInt(0, 100000),
      WorkerId: worker1_uuidv4,
      FirstName: faker.name.firstName(),
      LastName:  faker.name.lastName(),
      DateCreated: faker.date.recent(),
      Gender: genders[randomInt(0,2)],
      Location: locations[randomInt(0, locations.length)],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: randomInt(1, 80),
      DisabilityType: `{${disabilities[randomInt(0, disabilities.length)]}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: statuses[randomInt(0, statuses.length)],
      HealthDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      HealthGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationStatus: statuses[randomInt(0, statuses.length)],
      EducationDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: statuses[randomInt(0, statuses.length)],
      SocialDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      SocialGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Encouragement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location:locations[randomInt(0, locations.length)],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
    ],
    Referrals: [
      {
        WorkerId: worker1_uuidv4,
        PhysiotherapyService: {
          PhysiotherapyServiceId: uuid.v4(),
          Photo: default_profile,
          ClientCondition: null,
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: prosthetic_injury[randomInt(0,1)],
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: orthotic_injury[randomInt(0,1)],
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: client_proficiency[randomInt(0,1)],
          ClientHipWidth: randomInt(4, 100),
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${service_required[randomInt(0, service_required.length)]}}`,
        ReferTo: 'Disability Center',
        Status: referral_status[randomInt(0, 1)],
        Outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
  },

  {
    Client: {
      ClientId: randomInt(0, 100000),
      WorkerId: worker1_uuidv4,
      FirstName: faker.name.firstName(),
      LastName:  faker.name.lastName(),
      DateCreated: faker.date.recent(),
      Gender: genders[randomInt(0,2)],
      Location: locations[randomInt(0, locations.length)],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: randomInt(1, 80),
      DisabilityType: `{${disabilities[randomInt(0, disabilities.length)]}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: statuses[randomInt(0, statuses.length)],
      HealthDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      HealthGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationStatus: statuses[randomInt(0, statuses.length)],
      EducationDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: statuses[randomInt(0, statuses.length)],
      SocialDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      SocialGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Encouragement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location:locations[randomInt(0, locations.length)],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
    ],
    Referrals: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        PhysiotherapyService: {
          PhysiotherapyServiceId: uuid.v4(),
          Photo: default_profile,
          ClientCondition: null,
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: prosthetic_injury[randomInt(0,1)],
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: orthotic_injury[randomInt(0,1)],
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: client_proficiency[randomInt(0,1)],
          ClientHipWidth: randomInt(4, 100),
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${service_required[randomInt(0, service_required.length)]}}`,
        ReferTo: 'Disability Center',
        Status: referral_status[randomInt(0, 1)],
        Outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
  },

  {
    Client: {
      ClientId: randomInt(0, 100000),
      WorkerId: worker1_uuidv4,
      FirstName: faker.name.firstName(),
      LastName:  faker.name.lastName(),
      DateCreated: faker.date.recent(),
      Gender: genders[randomInt(0,2)],
      Location: locations[randomInt(0, locations.length)],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: randomInt(1, 80),
      DisabilityType: `{${disabilities[randomInt(0, disabilities.length)]}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: statuses[randomInt(0, statuses.length)],
      HealthDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      HealthGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationStatus: statuses[randomInt(0, statuses.length)],
      EducationDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: statuses[randomInt(0, statuses.length)],
      SocialDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      SocialGoal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          Encouragement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\',',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          GoalMet: goal_status[randomInt(0, 2)],
          ConcludedOutcome: '',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location:locations[randomInt(0, locations.length)],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
    ],
    Referrals: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        PhysiotherapyService: {
          PhysiotherapyServiceId: uuid.v4(),
          Photo: default_profile,
          ClientCondition: null,
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: prosthetic_injury[randomInt(0,1)],
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: orthotic_injury[randomInt(0,1)],
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: client_proficiency[randomInt(0,1)],
          ClientHipWidth: randomInt(4, 100),
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${service_required[randomInt(0, service_required.length)]}}`,
        ReferTo: 'Disability Center',
        Status: referral_status[randomInt(0, 1)],
        Outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
  },

  // Add new Clients Here
];

const results = SeedInterface(seedWorkers, seedClients);
module.exports = results;