import Sequelize, { Model } from 'sequelize';

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        message: Sequelize.STRING,
        user_token: Sequelize.STRING,
        events_number: Sequelize.NUMBER,
        level: Sequelize.ENUM('info', 'debug', 'warning', 'error', 'critical error'),
        environment: Sequelize.STRING,
        source: Sequelize.STRING,
        timestamp: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }
}

export default Log;
