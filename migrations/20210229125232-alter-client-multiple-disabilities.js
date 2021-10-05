module.exports = {
  up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('Client', 'DisabilityType')
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Client_DisabilityType";')

		await queryInterface.addColumn('Client', 'DisabilityType', {
			type: Sequelize.ARRAY(Sequelize.ENUM({
					values: [
						'Amputee', 'Polio', 
						'Spinal Cord Injury', 
						'Cerebral Palsy', 
						'Spina Bifida', 
						'Hydrocephalus', 
						'Visual Impairment',
						'Hearing Impairment', 
						'Don\'t Know', 'Other'
					]
				})
			),
			/* 
				bug when setting default value for some reason
				so temporarily allowNull but must validate nonNull on API requests 
			*/
			// defaultValue: ["Don't Know"], 
			allowNull: true,
			validate: {
				nonNull(val) {
					if (val == null) {
						throw new Error('Value must be non-null.')
					}
				}
			}
		})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Client', 'DisabilityType')
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Client_DisabilityType";')

		await queryInterface.addColumn('Client', 'DisabilityType', {
			type: Sequelize.ENUM,
			values: [
				'Amputee', 'Polio', 
				'Spinal Cord Injury', 
				'Cerebral Palsy', 
				'Spina Bifida', 
				'Hydrocephalus', 
				'Visual Impairment',
				'Hearing Impairment', 
				'Don\'t Know', 'Other'
			],
			defaultValue: 'Don\'t Know',
			allowNull: false
		})
  }
};