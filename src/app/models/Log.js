import Sequelize, { Model } from 'sequelize';

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },
        message: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },
        user_token: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },
        events_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isNumeric: true,
            notNull: true,
          },
        },
        level: {
          type: Sequelize.ENUM(
            'INFO',
            'DEBUG',
            'WARNING',
            'ERROR',
            'CRITICAL_ERROR'
          ),
          allowNull: false,
          validate: {
            notNull: true,
          },
        },
        environment: {
          type: Sequelize.ENUM('PRODUCAO', 'HOMOLOGACAO', 'DEV'),
          allowNull: false,
          validate: {
            notNull: true,
          },
        },
        source: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },
        timestamp: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: true,
            notNull: true,
          },
        },
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
