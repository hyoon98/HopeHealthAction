'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Client',{
      ClientId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FirstName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    LastName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Gender: {
        type: Sequelize.ENUM,
        values: ['Male', 'Female'],
        allowNull: false
    },
    Location: {
        type: Sequelize.ENUM,
        values: ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3', 'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
            'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'],
        allowNull: false
    },
    DateCreated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    ContactNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    VillageNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DisabilityType: {
        type: Sequelize.ENUM,
        values: ['Amputee', 'Polio', 'Spinal Cord Injury', 'Cerebral Palsy', 'Spina Bifida', 'Hydrocephalus', 'Visual Impairment',
            'Hearing Impairment', 'Don\'t Know', 'Other'],
        allowNull: false
    },
    Photo: {
        type: Sequelize.BLOB('long'),
        allowNull: false
    },
    GPSLocation: {
        type: Sequelize.STRING
    },
    Consent: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: false
    },
    CaregiverState: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: false
    },
    CaregiverContactNo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'N/A'
    },
    HealthStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    HealthDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    HealthGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EducationStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    EducationDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EducationGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    SocialStatus: {
        type: Sequelize.ENUM('Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'),
        allowNull: false
    },
    SocialDesc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    SocialGoal: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    WorkerId: {
        type: Sequelize.UUID,
        references: {
            model: 'Worker',
            key: 'WorkerId'
        }
    }
    },{
    tableName: 'Client',
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
    await queryInterface.dropTable('Client');
  }
};
