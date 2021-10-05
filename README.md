# CBR Manager #

The CBR (Community Based Rehabilitation) Manager application was created to help facilitating rehabilitation work in communities in the refugee settlements in BidiBidi and Paloryina, Northern Uganda to increase the impact of the work done by HHA (Hope Health Action). There are two / three main types of users. There are admins who oversee the entire process and workers who directly interact with the clients. Workers are responsible for adding clients to the database and filling in visit forms for them.  As of right now, this is only a web application, but a mobile application is desired at a later phase. Despite this, this web application will typically be accessed on mobile devices by workers and desktop by admins. Furthermore, there is ideally going to also be a feature to generate measurable data by the admins. This web application uses React as the frontend with NodeJS as the backend and PostgreSQL as the database. The sequelizer library was used so that writing queries was not necessary.

## Directory Structure ##

The root directory contains the files and directories for a NodeJS backend server with the “client” directory housing our frontend React application. Aside from the client directory, there are a few backend directories / files to take note of:

-	app.js: The starter NodeJS file 
-   config: Contains files for configuring connection to database
-	migrations: These are the migration files created by the sequelizer NodeJS library. They are to be ran to create all the necessary tables within a PostgreSQL database to house the data for the application and can also be ran with additional parameters to delete all the tables
-	models: The models for the various data objects that are used by the application
-	routes: This contains the files responsible for the backend API that accesses the database upon request. This is intended for the frontend to send HTTP requests to retrieve / add / edit / delete data objects.
-	seeders: Used to load some stock data into the web application for testing / demo purposes
-   tests/server: Contains the tests for our backend server

Within the client directory, there are two directories and the package.json file for all dependencies used in the backend. The public folder contains a stock index.html and icon for the site. Within the src files:

-	app.js: The starting file for the React application
-	routes.js: Contains the various routes in our web application and the component they’re responsible for loading up. Note that the routes are organized as an array of JSON objects
-	components: Functional components that can be reused for various pages
-	css: the css files used by some of the pages
-	pages: The functional components that are rendered for certain routes and all the components are functional components.
     - Are organized into various folders for related pages

## Build Directions / Dependencies / Run Instructions ##

### Installing Dependencies ###

Run in project root directory:
1) "npm install" for backend dependencies
2) "npm run client-install" for client dependencies

### Setting up the Database ###

1) Download any local [PostgreSQL server](https://www.postgresql.org/download/)

2) Connect to the server and create an empty database using the terminal or any GUI tool (TablePlus is a good option for Mac users).

3) Inside the project root directory create a ".env" file to setup your environment variables, the ".env" file should include:
    - DB_USERNAME = "your_postgres_username"
    - DB_PASSWORD = your_postgres_password (set it to null if doesn't exist)
    - DB_HOST = "localhost"
    - DB_DATABASE = "database_name"
    - DB_PORT = your_postgres_port (by default it is 5432)
    - DB_URL = "username:password@host_name:port/db_name" (in the same format) 

4) Run "node app.js" to start the server, if you get a "DB connection established successfully" message then you have successfully connected to your database, otherwise an error message will be shown in the console.

5) Run "npx sequelize-cli db:migrate" to let Sequelize create the database tables for you.

6) (Optional) Run "npx sequelize-cli db:seed --seed /seeders/demo3" to load the tables with the provided stock data.

### Enabling Google Maps Feature ### 

Some pages will display a Google Maps with a marker, which requires a Google Maps API key. To set this up for localhost:

1) Follow this [guide](https://developers.google.com/maps/documentation/embed/get-api-key) to obtain a Google Maps API key.

2) Create a .env file within the /client folder with the following "REACT_APP_GOOGLE_MAPS_API_KEY='api key'".

3) Enable the JavaScript Google Maps API in the Google Cloud Platform console.

**Note**: The above steps are optional for running on localhost, but will display "Map cannot load properly" error along with the "For developer purposes only" watermark. However, the map will still display the correct location with the marker in the right place.

### Additional Environmental Settings ###

For the web application to run on localhost, you'll need to add the following additional environmental variables to the root directory .env file:
- ACCESS_TOKEN_SECRET=474e765be37690bee00c75c3a3e5c8e6a2c8608f0798b1b6364e4d04d13edc324f4b5c94529e4841bd59cfd67160b1479a8acc1d9183bc2a05ff5041b1363e72

### Run Instructions ###

After all the set up is done, use the command "npm run start" in the project root directory and the client and server will start simultaneously.

## Deploying to Heroku ##

To deploy to Heroku, you'll need to do the following steps (create an Heroku account first if you didn't already do so):

1. Create an application on Heroku either through the web interface for the terminal commands.
2. Follow the provided instructions for deployment on the page after creating the application (i.e. git init -> heroku git:remote -a <app_name>)
3. Run "heroku addons:create heroku-postgresql:hobby-dev".
4. Push your code to the master branch of Heroku, which should trigger a build.
5. After the application has been successfully built by Heroku, run "heroku run npx sequelize-cli db:migrate" to create the necessary tables.
6. Before the application is fully functional, you'll need to add the environment variables ACCESS_TOKEN_SECRET (.env) and REACT_APP_GOOGLE_MAPS_API_KEY (client/.env). Follow this [guide](https://devcenter.heroku.com/articles/config-vars) for this process.
7. (Optional) Run "heroku run npx sequelize-cli db:seed --seed /seeders/demo3" to load web application with provided stock data.

## Testing ##

For this project, we've only got backend testing set up and working. To run the backend tests, you'll first need to set up some additional enviromment variables within the .env file in the root directory:
- DB_DATABASE_TEST=cbr_manager_database_test
- DB_URL_TEST=postgres:password@localhost:5432/cbr_manager_database_test

Next, you'll need to set up the testing enviromment by running the command "npm run pretest". Then you can run the tests using the command "npm run test:server".

**Note**: We only got a few APIs which have tests implemented.
