const Sequelize = require('sequelize');
const config = require('../config/database');

const User = require('../app/models/User');
const Log = require('../app/models/Log');

const connection = new Sequelize(config);

User.init(connection);
Log.init(connection);

module.exports = connection;
