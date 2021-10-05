const Sequelize = require('sequelize');
const db = require('../config/database');
const Alert = require('./alert');

const User = db.define('User', {
    Username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Role: {
        type: Sequelize.ENUM,
        values: ['Worker', 'Admin'],
        allowNull: false
    }
}, {
    tableName: 'User',
    timestamps: false
});

User.hasMany(Alert, {
    foreignKey:{
        name: 'AuthorUsername',
        type: Sequelize.STRING
    }
})

Alert.belongsTo(User, {foreignKey: 'AuthorUsername', targetKey: 'Username'})

module.exports = User;