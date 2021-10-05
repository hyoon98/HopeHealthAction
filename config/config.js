require('dotenv').config({path: '.env'});
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_TEST,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "logging": false,
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": 'postgres',
    "protocol": 'postgres',
    "ssl": true,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
};
