const { Sequelize } = require('sequelize');

//Connecting to DB

// Reference: https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
if (process.env.NODE_ENV === 'production')
{
    module.exports = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
} else if (process.env.NODE_ENV === 'test')
{
    module.exports = new Sequelize('postgres://' + process.env.DB_URL_TEST, {
        logging: false,
    });
}
else 
{
    module.exports = new Sequelize('postgres://' + process.env.DB_URL)
}
