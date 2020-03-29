# Squad 6 - Log API

#### This repository will have the code of our final project from AceleraDev Nodejs - Kroton. 

## Project Requirements
* Docker and Docker-Compose
#### OR
* Node.js LTS
* PostgreSQL

## Instructions

The default PORT for the application is: **3000**

The BASE_URL for the routes is: **localhost:3000/**

**Whatever you run on Docker or outside it, you will need to execute the Database Configurations.**

### Running on Docker
Execute the following command: **docker-compose up - d**.

### Running outside Docker
Before running it, you must provide your database credentials on file: _**config/database.js**_.

Execute the following command: **npm run dev**

### Database Configurations
Create the database **log_api_development**

Execute the following command: **npm run sync:dev**

### Routes

#### Routes that does not require authentication

* /api-docs - Access through the web browser and see the documentation (`Swagger`).
* /users - `POST`: Create User
* /session - `POST` : Login for web users.

#### Routes that require authentication (Bearer Token)

* /users/{id} - `GET`: Get info about a user.
* /users      -`PUT`: Update a user.
* /users/{id} - `DELETE`: Remove a user.

* /logs - `POST` : Save a log.
* /logs - `GET`: Search for logs.
* /logs/{id} - `GET`: Get specific info about a log.
* /logs/{id} - `PUT`: Archive a log.
* /logs/{id} - `DELETE`: Remove a log.

### Tests

This project has a coverage of 98%.

To run the tests, you need to create a database for it: **log_api_test**.

Then, run this command: **npm run sync:test**

To execute the tests: **npm run test** OR **npm run test:coverage**

#### Developed by:

* Adriano A. Tagliaferro (https://github.com/dritoferro)
* Talison Maturana (https://github.com/talisonmaturana)
* Thiago Rodrigues (https://github.com/Thiago92Rodrigues)
* Vinicius S Ricci (https://github.com/viniciussricci)
