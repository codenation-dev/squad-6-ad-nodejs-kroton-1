const { Op } = require('sequelize');
const Log = require('../models/Log');

const buildSearch = async req => {
  const environment = req.query.env;
  const { sortBy } = req.query;
  const sortOrder = req.query.sortOrder || 'DESC';
  const queryField = req.query.queryBy;
  const { queryValue } = req.query;

  const limit = req.query.limit || 100;
  const offset = req.query.offset || 0;

  const options = {};
  const countOptions = {};

  if (environment) {
    options.where = { environment };
    countOptions.where = { environment };
  }

  if (sortBy) {
    options.order = [[sortBy, sortOrder]];
    countOptions.order = [[sortBy, sortOrder]];
  }

  if (queryField) {
    if (queryField !== 'level') {
      const tmp = {
        ...options.where,

        [queryField]: {
          [Op.like]: `%${queryValue}%`,
        },
      };

      options.where = tmp;
      countOptions.where = tmp;
    } else {
      options.where = { level: queryValue };
      countOptions.where = { level: queryValue };
    }
  }

  options.offset = +offset;
  options.limit = +limit;

  return { options, countOptions };
};

const buildMeta = async (req, limit, offset, total) => {
  const { host } = req.headers;
  const base = req.originalUrl.split('?')[0];
  const { query } = req;

  const toIgnore = ['limit', 'offset'];

  const queries = Object.keys(query)
    .filter(key => !toIgnore.includes(key))
    .reduce((obj, key) => {
      obj.push(`${key}=${query[key]}`);
      return obj;
    }, []);

  const meta = {};

  if (limit + offset < total) {
    if (queries.length) {
      meta.next = `${host}${base}?${queries.join(
        '&'
      )}&limit=${limit}&offset=${limit + offset}`;
    } else {
      meta.next = `${host}${base}?limit=${limit}&offset=${limit + offset}`;
    }
  }

  if (offset > 0 && offset - limit >= 0) {
    if (queries.length) {
      meta.previous = `${host}${base}?${queries.join(
        '&'
      )}&limit=${limit}&offset=${offset - limit}`;
    } else {
      meta.previous = `${host}${base}?limit=${limit}&offset=${offset - limit}`;
    }
  }
  meta.total = total;

  return meta;
};

class LogController {
  async saveLog(req, res) {
    try {
      const log = req.body;
      const token = req.headers.authorization.split(' ')[1];
      log.user_token = token;

      const result = await Log.create(log);

      res.status(201).json(result);
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
