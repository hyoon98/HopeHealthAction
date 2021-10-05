module.exports = function SeedInterfaceForVisits(seedVisits) {
    return {
        up: async (queryInterface, Sequelize) => {
        
            for (let i = 0; i < seedVisits.length; i++) {
            
                if (seedVisits[i].HealthForm.HealthFormId != null) {
                    await queryInterface.bulkInsert('HealthForm', [
                        seedVisits[i].HealthForm, 
                    ]);
                }
                if (seedVisits[i].EducationForm.EducationFormId != null) {
                    await queryInterface.bulkInsert('EducationForm', [
                        seedVisits[i].EducationForm,
                    ]);
                }
                if (seedVisits[i].SocialForm.SocialFormId != null) {
                    await queryInterface.bulkInsert('SocialForm', [
                        seedVisits[i].SocialForm,
                    ]);
                }

                await queryInterface.bulkInsert('Visit', [
                    {
                        ClientId: seedVisits[i].ClientId,
                        WorkerId: seedVisits[i].WorkerId,
                        VisitId: seedVisits[i].VisitId,
                        HealthFormId: seedVisits[i].HealthForm.HealthFormId,
                        EducationFormId: seedVisits[i].EducationForm.EducationFormId,
                        SocialFormId: seedVisits[i].SocialForm.SocialFormId,
                        VisitPurpose: seedVisits[i].VisitPurpose,
                        GPSLocation: seedVisits[i].GPSLocation,
                        Date: seedVisits[i].Date,
                        Location: seedVisits[i].Location,
                        VillageNumber: Number(seedVisits[i].VillageNumber),
                    },
                ]);
            }
        },

        down: async (queryInterface, Sequelize) => {
        }
    }
}