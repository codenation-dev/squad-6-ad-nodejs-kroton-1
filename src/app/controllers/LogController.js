const Log = require('../models/Log');
const { buildSearch, buildMeta } = require('../utils/SearchHelper');

class LogController {
  async saveLog(req, res) {
    try {
      const log = req.body;
      const token = req.headers.authorization.split(' ')[1];
      log.user_token = token;

      const result = await Log.create(log);

      return res.status(201).json(result);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const fields = await Promise.all(
          error.errors.map(async err => {
            return {
              message: err.message,
              field: err.path,
              wrongValue: err.value,
              validation: err.validatorName,
            };
          })
        );
        return res.status(400).json({ error: 'Validation Errors', fields });
      }
      return res.status(400).json(error);
    }
  }

  async getLogById(req, res) {
    try {
      const { id } = req.params;

      const result = await Log.findByPk(id);

      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Cannot find with id especified' });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        stack: error,
      });
    }
  }

  async searchLog(req, res) {
    try {
      const { options, countOptions } = await buildSearch(req);

      const results = await Log.findAll(options);
      const total = await Log.count(countOptions);

      const { limit } = options;
      const { offset } = options;

      const meta = await buildMeta(req, +limit, +offset, total);

      res.status(200).json({ meta, results });
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        stack: error,
      });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;

      const result = await Log.destroy({
        where: {
          id,
        },
      });

      if (result) {
        res.status(204).json();
      } else {
        res.status(404).json({ message: 'Cannot drop, object not found' });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        stack: error,
      });
    }
  }

  async toArchive(req, res) {
    try {
      const { id } = req.params;

      const result = await Log.update(
        { toArchive: true },
        {
          where: {
            id,
          },
        }
      );

      if (result[0]) {
        res.status(200).json({ message: 'Archived successfully' });
      } else {
        res.status(404).json({ message: 'Cannot archive, object not found' });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        stack: error,
      });
    }
  }
}

module.exports = new LogController();
