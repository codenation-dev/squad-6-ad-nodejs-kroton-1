import Sequelize from 'sequelize';
import config from '../config/database';

import User from '../app/models/User';
import Log from '../app/models/Log';

const connection = new Sequelize(config);

User.init(connection);
Log.init(connection);

export default connection;
