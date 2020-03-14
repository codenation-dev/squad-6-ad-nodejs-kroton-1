import connection from '../database/index';

connection.sync().then(() => process.exit(0));
