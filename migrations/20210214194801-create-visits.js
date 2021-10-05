'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    queryInterface.createTable('Visit', {
    VisitId: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      primaryKey: true
    },
    VisitPurpose: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    GPSLocation: {
      type: Sequelize.FLOAT(),
      allowNull: true
    },
    Date: {
      type: Sequelize.DATEONLY,
      default: Sequelize.NOW,
      allowNull: false
    },
    Location: {
      type: Sequelize.ENUM,
      values: ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
          'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'],
      allowNull: false
    },
    VillageNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    WorkerId: {
        type: Sequelize.UUID,
        references: {
            model: 'Worker',
            key: 'WorkerId'
        }
    },
    ClientId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Client',
            key: 'ClientId'
        }
    },
    HealthFormId: {
        type: Sequelize.UUID,
        references: {
            model: 'HealthForm',
            key: 'HealthFormId'
        }
    },
    EducationFormId: {
        type: Sequelize.UUID,
        references: {
            model: 'EducationForm',
            key: 'EducationFormId'
        }
    },
    SocialFormId: {
        type: Sequelize.UUID,
        references: {
            model: 'SocialForm',
            key: 'SocialFormId'
        }
    },
    },{
      tableName: 'Visit',
      timestamps: false
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Visit');
  }
};
