'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Referral', 'ReferTo', {
        type: Sequelize.ENUM,
        values: ['Disability Center', 'Mobile Clinic'],
        allowNull: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Referral', 'ReferTo', {
        type: Sequelize.STRING,
        allowNull: false
      }
    )

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Referral_ReferTo"');
  }
};
