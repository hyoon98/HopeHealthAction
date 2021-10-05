'use strict';
const faker = require('faker');
const fs = require('fs');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SeedInterface = require('./utils/SeedInterface');

const locations = ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
  'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'];
const num_villages = 6;
const default_profile = fs.readFileSync('./image/default-profile.jpg');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const worker1_uuidv4 = '7b2aff58-60fb-4f42-aa3b-21760ed4c134';
const worker2_uuidv4 = '53e996ff-6c85-4e3e-b7c8-ff31edd93239';

const defaultPassword = bcrypt.hashSync('123456', 10);

  let seedWorkers = [
    {
      Worker: {
        WorkerId: worker1_uuidv4,
        FirstName: 'Diantha',
        LastName: 'Wilkerson',
        Photo: '',
        Location: locations[0],
      },
      User: {
        WorkerId: worker1_uuidv4,
        Username: 'worker1',
        Password: defaultPassword,
        Role: 'Worker'
      }
    },
    {
      Worker: {
        WorkerId: worker2_uuidv4,
        FirstName: 'Teagan',
        LastName: 'Gabriels',
        Photo: '',
        Location: locations[6],
      },
      User: {
        WorkerId: worker2_uuidv4,
        Username: 'worker2',
        Password: defaultPassword,
        Role: 'Worker'
      }
    },
    {
      Worker: null,
      User: {
        WorkerId: null,
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
      ClientId: 1,
      WorkerId: worker1_uuidv4,
      FirstName: 'Filbert',
      LastName:  'Olayinka',
      DateCreated: faker.date.recent(),
      Gender: 'Male',
      Location: locations[0],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: 28,
      DisabilityType: `{${['Amputee']}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: 'Critical Risk',
      HealthDesc: 'They require a prosthetic due to missing left leg above the knee.',
      HealthGoal: 'Acquire a wheelchair.',
      EducationStatus: 'Critical Risk',
      EducationDesc: 'Unable to read and write.',
      EducationGoal: 'Get enrolled at adult education center?',
      SocialStatus: 'Low Risk',
      SocialDesc: 'Part of the community and has caretaker.',
      SocialGoal: 'Maintain status.',
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'Wheelchair was provided.',
          Advice: 'Focus on getting around on your own.',
          Encouragement: 'He is excited to get comfortable with his wheelchair',
          GoalMet: 'Concluded',
          ConcludedOutcome: 'Acquired Wheelchair',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          OrganizationReferral: 'Created a referral to a local adult eduction centre.',
          GoalMet: 'Ongoing',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Keep up the good work!',
          GoalMet: 'Ongoing',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[0],         // Are visits Limited to the same location as the client?
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
          ClientCondition: 'Amputee',
        },
        ProstheticService: {
          ProstheticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above knee',
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above elbow',
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: 'Basic',
          ClientHipWidth: 33,
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${['Wheelchair', 'Prosthetic']}}`,
        ReferTo: 'Disability Center',
        Status: 'Made',
        Outcome: 'Still waiting for the wheelchair',
      },
    ],
    BaselineSurvey: {
      BaselineSurveyId: uuid.v4(),
      Date: faker.date.recent(),
      SocialSurvey: {
        SocialSurveyId: uuid.v4(),
        ValuedCommunityMember: true,
        Independence: true,
        CommunityParticipation: true,
        DisabilityImpact: true,
        Discrimination: true
      },
      ShelterSurvey: {
        ShelterSurveyId: uuid.v4(),
        ShelterAccess: true,
        EssentialsAccess: true
      },
      NutritionSurvey: {
        NutritionSurveyId: uuid.v4(),
        FoodStatus: "Fine",
        MonthlyFoodAccess: true,
        ChildNutritionStatus: null
      },
      LivelihoodSurvey: {
        LivelihoodSurveyId: uuid.v4(),
        WorkStatus: true,
        WorkDescription: "Office work",
        EmploymentType: "Employed",
        FinancialNeedsMet: true,
        DisabilityImpact: true,
        WorkWanted: false
      },
      EmpowermentSurvey: {
        EmpowermentSurveyId: uuid.v4(),
        DisabilityOrganizationMember: true,
        DisabilityOrganizations: ["Disability Empowerment, WAH"],
        AwareDisabilityRights: true,
        Influential: true
      },
      // No education because over 18
      EducationSurvey: {
        EducationSurveyId: null,
      },
      HealthSurvey: {
        HealthSurveyId: uuid.v4(),
        HealthStatus: "Very Poor",
        RehabilitationAccess: true,
        RehabilitationAccessNeeded: false,
        AssistiveDevice: false,
        AssistiveDeviceWorking: false,
        AssistiveDeviceNeeded: true,
        AssistiveDeviceRequired: `{${['Wheelchair', 'Prosthetic']}}`,
        HealthServiceStatus: "Fine"
      }
    }
  },

  {
    Client: {
      ClientId: 2,
      WorkerId: worker1_uuidv4,
      FirstName: 'Hadiza',
      LastName:  'Kariuki',
      DateCreated: faker.date.recent(),
      Gender: 'Female',
      Location: locations[0],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: 13,
      DisabilityType: `{${['Visual Impairment']}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: 'Low Risk',
      HealthDesc: 'Needs glasses',
      HealthGoal: 'Book optometrist appointment. Get glasses.',
      EducationStatus: 'Critical Risk',
      EducationDesc: 'Due to lack of vision she cannot read the board and her school is suffering',
      EducationGoal: 'Get tutor and catch up to other students.',
      SocialStatus: 'Low Risk',
      SocialDesc: 'Good',
      SocialGoal: 'Maintain',
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
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
          SocialFormId: uuid.v4(),
          Encouragement: 'Keep up the good work!',
          GoalMet: 'Ongoing',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[0],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          GoalMet: 'Concluded',
          HealthCenterReferral: 'Optometrist appointment',
          ConcludedOutcome: 'She requires some glasses that have been ordered',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          GoalMet: 'Canceled',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          GoalMet: 'Canceled',
        },
        VisitPurpose: 'Disability centre referral follow up',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[0],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      }
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
          InjuryPosition: 'Above knee',
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above elbow',
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: 'Intermediate',
          ClientHipWidth: 10,
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${['Other']}}`,
        OtherServices: 'Had an optometrist appointment',
        ReferTo: 'Disability Center',
        Status: 'Resolved',
        Outcome: 'They got the glasses.',
      },
    ],
    BaselineSurvey: {
      BaselineSurveyId: uuid.v4(),
      Date: faker.date.recent(),
      SocialSurvey: {
        SocialSurveyId: uuid.v4(),
        ValuedCommunityMember: true,
        Independence: false,
        CommunityParticipation: true,
        DisabilityImpact: true,
        Discrimination: false
      },
      ShelterSurvey: {
        ShelterSurveyId: uuid.v4(),
        ShelterAccess: true,
        EssentialsAccess: true
      },
      NutritionSurvey: {
        NutritionSurveyId: uuid.v4(),
        FoodStatus: "Good",
        MonthlyFoodAccess: true,
        ChildNutritionStatus: "Well Nourished"
      },
      //No livelihood because under 16
      LivelihoodSurvey: {
        LivelihoodSurveyId: null,
      },
      EmpowermentSurvey: {
        EmpowermentSurveyId: uuid.v4(),
        DisabilityOrganizationMember: false,
        DisabilityOrganizations: ["N/A"],
        AwareDisabilityRights: false,
        Influential: false
      },
      EducationSurvey: {
        EducationSurveyId: uuid.v4(),
         SchoolState: true,
         CurrentGrade: "8",
         NoSchoolReason: null,
         SchoolBefore: true,
         WantSchool: true
      },
      HealthSurvey: {
        HealthSurveyId: uuid.v4(),
        HealthStatus: "Good",
        RehabilitationAccess: false,
        RehabilitationAccessNeeded: false,
        AssistiveDevice: false,
        AssistiveDeviceWorking: false,
        AssistiveDeviceNeeded: true,
        AssistiveDeviceRequired: `{${['Glasses']}}`,
        HealthServiceStatus: "Fine"
      }
    }
  },

  {
    Client: {
      ClientId: 3,
      WorkerId: worker1_uuidv4,
      FirstName: 'Chifuniro',
      LastName:  'Obama',
      DateCreated: faker.date.recent(),
      Gender: 'Male',
      Location: locations[0],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: 35,
      DisabilityType: `{${['Spinal Cord Injury']}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: 'Critical Risk',
      HealthDesc: 'Needs a wheelchair',
      HealthGoal: 'Get a wheelchair',
      EducationStatus: 'Low Risk',
      EducationDesc: 'Smart guy.',
      EducationGoal: 'Continue to read.',
      SocialStatus: 'Medium Risk',
      SocialDesc: 'He needs to be carried around, so his social interactions are rare.',
      SocialGoal: 'Get wheelchair so he can start going to social gatherings.',
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Wheelchair: 'We need to get you a wheelchair so you can be more active.',
          GoalMet: 'Ongoing',
        },
        EducationForm: {
          EducationFormId: uuid.v4(),
          GoalMet: 'Canceled',
        },
        SocialForm: {
          SocialFormId: uuid.v4(),
          Advice: 'Get out more.',
          Encouragement: 'You will be more mobile again soon.',
          GoalMet: 'Ongoing',
        },
        VisitPurpose: 'Disability centre referral',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[0],         // Are visits Limited to the same location as the client?
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
          InjuryPosition: 'Above knee',
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above elbow',
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: 'Intermediate',
          ClientHipWidth: 24,
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${['Wheelchair']}}`,
        ReferTo: 'Mobile Clinic',
        Status: 'Resolved',
        Outcome: 'He has left with the wheelchair.',
      },
    ],
    BaselineSurvey: {
      BaselineSurveyId: uuid.v4(),
      Date: faker.date.recent(),
      SocialSurvey: {
        SocialSurveyId: uuid.v4(),
        ValuedCommunityMember: false,
        Independence: false,
        CommunityParticipation: true,
        DisabilityImpact: true,
        Discrimination: false
      },
      ShelterSurvey: {
        ShelterSurveyId: uuid.v4(),
        ShelterAccess: false,
        EssentialsAccess: false
      },
      NutritionSurvey: {
        NutritionSurveyId: uuid.v4(),
        FoodStatus: "Poor",
        MonthlyFoodAccess: false,
        ChildNutritionStatus: null
      },
      LivelihoodSurvey: {
        LivelihoodSurveyId: uuid.v4(),
        WorkStatus: false,
        WorkDescription: "N/A",
        EmploymentType: null,
        FinancialNeedsMet: false,
        DisabilityImpact: true,
        WorkWanted: true
      },
      EmpowermentSurvey: {
        EmpowermentSurveyId: uuid.v4(),
        DisabilityOrganizationMember: false,
        DisabilityOrganizations: ["N/A"],
        AwareDisabilityRights: false,
        Influential: false
      },
      // No education because older than 18
      EducationSurvey: {
        EducationSurveyId: null,
      },
      HealthSurvey: {
        HealthSurveyId: uuid.v4(),
        HealthStatus: "Very Poor",
        RehabilitationAccess: false,
        RehabilitationAccessNeeded: true,
        AssistiveDevice: false,
        AssistiveDeviceWorking: false,
        AssistiveDeviceNeeded: true,
        AssistiveDeviceRequired: `{${['Wheelchair']}}`,
        HealthServiceStatus: "Poor"
      }
    }
  },

  {
    Client: {
      ClientId: 4,
      WorkerId: worker2_uuidv4,
      FirstName: 'Alhassan',
      LastName:  'Afolayan',
      DateCreated: faker.date.recent(),
      Gender: 'Male',
      Location: locations[6],
      ContactNo: faker.phone.phoneNumberFormat(),
      VillageNumber: randomInt(1, num_villages),
      Age: 17,
      DisabilityType: `{${['Cerebral Palsy']}}`,
      GPSLocation: '',
      Consent: 'Y',
      CaregiverState: 'Y',
      Photo: default_profile,
      CaregiverContactNo: faker.phone.phoneNumberFormat(),
      HealthStatus: 'Critical Risk',
      HealthDesc: 'Struggles to walk with old crutches.',
      HealthGoal: 'Keep doing exercises personally, get new crutches.',
      EducationStatus: 'Medium Risk',
      EducationDesc: 'Missed out on school due to pain.',
      EducationGoal: 'Read some books.',
      SocialStatus: 'Low Risk',
      SocialDesc: 'Dudes pretty cool',
      SocialGoal: 'Maintain',
      Priority: randomInt(0, 10)
    },
    Visits: [
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
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
          SocialFormId: uuid.v4(),
          GoalMet: 'Canceled',
        },
        VisitPurpose: 'CBR',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[6],         // Are visits Limited to the same location as the client?
        VillageNumber: randomInt(1, num_villages),
      },
      {
        ClientId: null,
        WorkerId: worker1_uuidv4,
        VisitId: uuid.v4(),
        HealthForm: {
          HealthFormId: uuid.v4(),
          Orthotic: 'Sounds like the referral went well.',
          Encouragement: 'You are doing great!',
          GoalMet: 'Concluded',
          ConcludedOutcome: 'He is doing much better, we can lower his risk level.',
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
        VisitPurpose: 'Disability center referral follow up',
        GPSLocation: 0,
        Date: faker.date.recent(),
        Location: locations[6],         // Are visits Limited to the same location as the client?
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
          InjuryPosition: 'Above knee',
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above elbow',
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: 'Basic',
          ClientHipWidth: 10,
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${['Orthotic']}}`,
        ReferTo: 'Mobile Clinic',
        Status: 'Resolved',
        Outcome: 'Positive',
      },
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
          InjuryPosition: 'Above knee',
        },
        OrthoticService: {
          OrthoticServiceId: uuid.v4(),
          Photo: default_profile,
          InjuryPosition: 'Above elbow',
        },
        WheelchairService: {
          WheelchairServiceId: uuid.v4(),
          Photo: default_profile,
          ClientProficiency: 'Basic',
          ClientHipWidth: 10,
          WheelchairExist: 'Y',
        },
        ReferralId: uuid.v4(),
        Date: faker.date.recent(),
        ServiceRequired: `{${['Other', 'Physiotherapy']}}`,
        OtherServices: 'Get some new crutches.',
        ReferTo: 'Mobile Clinic',
        Status: 'Made',
      },
    ],
    BaselineSurvey: {
      BaselineSurveyId: uuid.v4(),
      Date: faker.date.recent(),
      SocialSurvey: {
        SocialSurveyId: uuid.v4(),
        ValuedCommunityMember: true,
        Independence: false,
        CommunityParticipation: true,
        DisabilityImpact: true,
        Discrimination: false
      },
      ShelterSurvey: {
        ShelterSurveyId: uuid.v4(),
        ShelterAccess: true,
        EssentialsAccess: true
      },
      NutritionSurvey: {
        NutritionSurveyId: uuid.v4(),
        FoodStatus: "Fine",
        MonthlyFoodAccess: true,
        ChildNutritionStatus: null
      },
      LivelihoodSurvey: {
        LivelihoodSurveyId: uuid.v4(),
        WorkStatus: false,
        WorkDescription: "N/A",
        EmploymentType: null,
        FinancialNeedsMet: false,
        DisabilityImpact: true,
        WorkWanted: false
      },
      EmpowermentSurvey: {
        EmpowermentSurveyId: uuid.v4(),
        DisabilityOrganizationMember: true,
        DisabilityOrganizations: ["BMS"],
        AwareDisabilityRights: true,
        Influential: true
      },
      EducationSurvey: {
        EducationSurveyId: uuid.v4(),
         SchoolState: true,
         CurrentGrade: "12",
         NoSchoolReason: "My Disability Stops me",
         SchoolBefore: true,
         WantSchool: true
      },
      HealthSurvey: {
        HealthSurveyId: uuid.v4(),
        HealthStatus: "Fine",
        RehabilitationAccess: false,
        RehabilitationAccessNeeded: true,
        AssistiveDevice: true,
        AssistiveDeviceWorking: false,
        AssistiveDeviceNeeded: true,
        AssistiveDeviceRequired: `{${['Crutch']}}`,
        HealthServiceStatus: "Fine"
      }
    }
  },

  // Add new Clients Here
];

let seedAlerts = [
    {
      AlertId: 1,
      Date: faker.date.recent(),
      Title: 'Monthly check-in',
      Message: 'Please come to the main office tomorrow at 6pm for our monthly check-in meetings',
      SpecificWorkers: null,
      ForAllWorkers: true,
      AuthorUsername: 'admin'
    },
    {
      AlertId: 2,
      Date: faker.date.recent(),
      Title: 'One on one meeting',
      Message: 'Reminder tomorrow at 2pm is our regular one on one meeting',
      SpecificWorkers: `{${[worker1_uuidv4]}}`,
      ForAllWorkers: false,
      AuthorUsername: 'admin'
    },
    {
      AlertId: 3,
      Date: faker.date.recent(),
      Title: 'General meeting Reminder',
      Message: 'Reminder today at 12pm is our general meeting in the main office!',
      SpecificWorkers: null,
      ForAllWorkers: true,
      AuthorUsername: 'admin'
    },
    {
      AlertId: 4,
      Date: faker.date.recent(),
      Title: 'Meeting postponed',
      Message: 'Meeting for workers in Palorinya Zone 1 has been moved to next Thursday',
      SpecificWorkers: `{${[worker2_uuidv4]}}`,
      ForAllWorkers: false,
      AuthorUsername: 'admin'
    },
];

const results = SeedInterface(seedWorkers, seedClients, seedAlerts);
module.exports = results;