const connection = require('../database/index');

connection.sync().then(() => process.exit(0));
