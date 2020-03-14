import Sequelize, { Model } from 'sequelize';

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        message: Sequelize.STRING,
        user_token: Sequelize.STRING,
        events_number: Sequelize.INTEGER,
        level: Sequelize.ENUM(
          'info',
          'debug',
          'warning',
          'error',
          'critical error'
        ),
        environment: Sequelize.ENUM('producao', 'homologacao', 'dev'),
        source: Sequelize.STRING,
        timestamp: Sequelize.DATE,
        toArchive: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
      }
    );
  }
}

export default Log;
