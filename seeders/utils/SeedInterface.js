module.exports = function SeedInterface(seedWorkers, seedClients, seedAlerts) {
    return {
        up: async (queryInterface, Sequelize) => {

            for (let i = 0; i < seedWorkers.length; i++) {
                // Create Workers and associated User accounts

                if (seedWorkers[i].Worker !== null) {
                    await queryInterface.bulkInsert('Worker', [
                    seedWorkers[i].Worker
                    ]);
                }

                await queryInterface.bulkInsert('User', [
                    seedWorkers[i].User,
                ]);
            }

            // Add clients and associated visits and referrals
            for (let i = 0; i < seedClients.length; i++) {

                const clients = await queryInterface.bulkInsert('Client', [
                    seedClients[i].Client,
                ], {returned: ['ClientId']});

                for (let j = 0; j < seedClients[i].Visits.length; j++) {

                    await queryInterface.bulkInsert('HealthForm', [
                        seedClients[i].Visits[j].HealthForm,

                    ]);

                    await queryInterface.bulkInsert('EducationForm', [
                        seedClients[i].Visits[j].EducationForm,

                    ]);

                    await queryInterface.bulkInsert('SocialForm', [
                        seedClients[i].Visits[j].SocialForm,

                    ]);

                    await queryInterface.bulkInsert('Visit', [
                        {
                            ClientId: seedClients[i].Client.ClientId,
                            WorkerId: seedClients[i].Visits[j].WorkerId,
                            VisitId: seedClients[i].Visits[j].VisitId,
                            HealthFormId: seedClients[i].Visits[j].HealthForm.HealthFormId,
                            EducationFormId: seedClients[i].Visits[j].EducationForm.EducationFormId,
                            SocialFormId: seedClients[i].Visits[j].SocialForm.SocialFormId,
                            VisitPurpose: seedClients[i].Visits[j].VisitPurpose,
                            GPSLocation: seedClients[i].Visits[j].GPSLocation,
                            Date: seedClients[i].Visits[j].Date,
                            Location: seedClients[i].Client.Location,
                            VillageNumber: Number(seedClients[i].Client.VillageNumber),
                        },
                    ]);
                }

                for (let j = 0; j < seedClients[i].Referrals.length; j++) {

                    await queryInterface.bulkInsert('PhysiotherapyService', [
                        {
                            PhysiotherapyServiceId: seedClients[i].Referrals[j].PhysiotherapyService.PhysiotherapyServiceId,
                            Photo: seedClients[i].Referrals[j].PhysiotherapyService.Photo,
                            ClientCondition: seedClients[i].Client.DisabilityType,
                        },

                    ]);

                    await queryInterface.bulkInsert('ProstheticService', [
                        seedClients[i].Referrals[j].ProstheticService,

                    ]);

                    await queryInterface.bulkInsert('OrthoticService', [
                        seedClients[i].Referrals[j].OrthoticService,

                    ]);

                    await queryInterface.bulkInsert('WheelchairService', [
                        seedClients[i].Referrals[j].WheelchairService,
                    ]);

                    await queryInterface.bulkInsert('Referral', [
                        {
                            ClientId: seedClients[i].Client.ClientId,
                            WorkerId: seedClients[i].Referrals[j].WorkerId,
                            PhysiotherapyServiceId: seedClients[i].Referrals[j].PhysiotherapyService.PhysiotherapyServiceId,
                            ProstheticServiceId: seedClients[i].Referrals[j].ProstheticService.ProstheticServiceId,
                            OrthoticServiceId: seedClients[i].Referrals[j].OrthoticService.OrthoticServiceId,
                            WheelchairServiceId: seedClients[i].Referrals[j].WheelchairService.WheelchairServiceId,
                            ReferralId: seedClients[i].Referrals[j].ReferralId,
                            Date: seedClients[i].Referrals[j].Date,
                            ServiceRequired: seedClients[i].Referrals[j].ServiceRequired,
                            OtherServices: seedClients[i].Referrals[j].OtherServices,
                            ReferTo: seedClients[i].Referrals[j].ReferTo,
                            Status: seedClients[i].Referrals[j].Status,
                            Outcome: seedClients[i].Referrals[j].Outcome,
                        },
                    ]);

                }

                // Add baseline surveys and sub tables
                await queryInterface.bulkInsert('SocialSurvey', [
                    seedClients[i].BaselineSurvey.SocialSurvey,
                ]);
                await queryInterface.bulkInsert('ShelterSurvey', [
                    seedClients[i].BaselineSurvey.ShelterSurvey,
                ]);
                await queryInterface.bulkInsert('NutritionSurvey', [
                    seedClients[i].BaselineSurvey.NutritionSurvey,
                ]);
                if (seedClients[i].BaselineSurvey.LivelihoodSurvey.LivelihoodSurveyId != null) {
                    await queryInterface.bulkInsert('LivelihoodSurvey', [
                        seedClients[i].BaselineSurvey.LivelihoodSurvey,
                    ]);
                }
                await queryInterface.bulkInsert('EmpowermentSurvey', [
                    seedClients[i].BaselineSurvey.EmpowermentSurvey,
                ]);

                if (seedClients[i].BaselineSurvey.EducationSurvey.EducationSurveyId != null) {
                    await queryInterface.bulkInsert('EducationSurvey', [
                        seedClients[i].BaselineSurvey.EducationSurvey,
                    ]);
                }
                await queryInterface.bulkInsert('HealthSurvey', [
                    seedClients[i].BaselineSurvey.HealthSurvey,
                ]);

                await queryInterface.bulkInsert('BaselineSurvey', [
                    {
                        BaselineSurveyId: seedClients[i].BaselineSurvey.BaselineSurveyId,
                        Date: seedClients[i].BaselineSurvey.Date,
                        WorkerId: seedClients[i].Client.WorkerId,
                        ClientId: seedClients[i].Client.ClientId,
                        SocialSurveyId: seedClients[i].BaselineSurvey.SocialSurvey.SocialSurveyId,
                        ShelterSurveyId: seedClients[i].BaselineSurvey.ShelterSurvey.ShelterSurveyId,
                        NutritionSurveyId: seedClients[i].BaselineSurvey.NutritionSurvey.NutritionSurveyId,
                        LivelihoodSurveyId: seedClients[i].BaselineSurvey.LivelihoodSurvey.LivelihoodSurveyId,
                        EmpowermentSurveyId: seedClients[i].BaselineSurvey.EmpowermentSurvey.EmpowermentSurveyId,
                        EducationSurveyId: seedClients[i].BaselineSurvey.EducationSurvey.EducationSurveyId,
                        HealthSurveyId: seedClients[i].BaselineSurvey.HealthSurvey.HealthSurveyId,
                    }
                ]);

            }

            // Outside of all clients, add alerts
            for (let i = 0; i < seedAlerts.length; i++) {
                await queryInterface.bulkInsert('Alert', [
                    seedAlerts[i],
                ]);
            }
        },

        down: async (queryInterface, Sequelize) => {
            await queryInterface.bulkDelete('Referral', null, {});
            await queryInterface.bulkDelete('PhysiotherapyService', null, {});
            await queryInterface.bulkDelete('ProstheticService', null, {});
            await queryInterface.bulkDelete('OrthoticService', null, {});
            await queryInterface.bulkDelete('WheelchairService', null, {});
            await queryInterface.bulkDelete('Visit', null, {});
            await queryInterface.bulkDelete('HealthForm', null, {});
            await queryInterface.bulkDelete('EducationForm', null, {});
            await queryInterface.bulkDelete('SocialForm', null, {});
            await queryInterface.bulkDelete('BaselineSurvey', null, {});
            await queryInterface.bulkDelete('SocialSurvey', null, {});
            await queryInterface.bulkDelete('EducationSurvey', null, {});
            await queryInterface.bulkDelete('EmpowermentSurvey', null, {});
            await queryInterface.bulkDelete('HealthSurvey', null, {});
            await queryInterface.bulkDelete('LivelihoodSurvey', null, {});
            await queryInterface.bulkDelete('NutritionSurvey', null, {});
            await queryInterface.bulkDelete('ShelterSurvey', null, {});
            await queryInterface.bulkDelete('Client', null, {});
            await queryInterface.bulkDelete('Alert', null, {});
            await queryInterface.bulkDelete('User', null, {});
            await queryInterface.bulkDelete('Worker', null, {});
        }
    }
}