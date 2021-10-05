const Sequelize = require('sequelize');
const db = require('../config/database');

const Alert = db.define('Alert', {
    AlertId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Title: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Message: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    SpecificWorkers: {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true
    },
    ForAllWorkers: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
}, {
    tableName: 'Alert',
    timestamps: false
});

module.exports = Alert;