const { DATABASE_URL = 'database' } = process.env;

const Sequelize = require('sequelize');
const config = require('../config/database');

const User = require('../app/models/User');
const Log = require('../app/models/Log');

let connection;
console.log({ DATABASE_URL });

console.log({ db_url: DATABASE_URL.includes('postgres://') });

if (DATABASE_URL.includes('postgres://')) {
  console.log('Entrou no if');

  connection = new Sequelize({
    dialect: 'postgres',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    connectionString: DATABASE_URL,
  });
} else {
  console.log('Entrou no else');

  connection = new Sequelize(config);
}

User.init(connection);
Log.init(connection);

module.exports = connection;
