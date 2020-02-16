import Sequelize from 'sequelize';
import config from '../config/database';

import User from '../app/models/User';
//import Logs from '../app/models/Logs';

const connection = new Sequelize(config);

User.init(connection);
//Logs.init(connection);

export default connection;
