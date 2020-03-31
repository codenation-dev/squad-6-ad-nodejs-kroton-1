const { DATABASE_URL = 'database' } = process.env;

const Sequelize = require('sequelize');
const parser = require('pg-connection-string').parse;
const config = require('../config/database');

const User = require('../app/models/User');
const Log = require('../app/models/Log');

let connection;

if (DATABASE_URL.includes('postgres://')) {
  const options = parser(DATABASE_URL);
  const obj = {};
  obj.host = options.host;
  obj.username = options.user;
  obj.password = options.password;
  obj.database = options.database;

  connection = new Sequelize({ ...obj, dialect: 'postgres' });
} else {
  connection = new Sequelize(config);
}

User.init(connection);
Log.init(connection);

module.exports = connection;
