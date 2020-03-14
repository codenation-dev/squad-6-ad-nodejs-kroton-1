import { Op } from 'sequelize';
import Log from '../models/Log';

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
    options.where = {
      ...options.where,

      [queryField]: {
        [Op.like]: `%${queryValue}%`,
      },
    };

    countOptions.where = {
      ...options.where,

      [queryField]: {
        [Op.like]: `%${queryValue}%`,
      },
    };
  }

  options.limit = limit;
  options.offset = offset;

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

  if (offset > 0 && offset - limit > 0) {
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
  async getLogById(req, res) {
    try {
      const { id } = req.params;

      if (id) {
        const result = await Log.findByPk(id);

        if (result) {
          res.send(200).json(result);
        } else {
          res.send(400).json({ message: 'Cannot find with id especified' });
        }
      } else {
        res.status(400).json({ message: 'Id cannot be null' });
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
      const total = (await Log.findAll(countOptions)).length;

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

      if (id) {
        const result = await Log.destroy({
          where: {
            id,
          },
        });

        if (result) {
          res.status(204).json();
        } else {
          res.status(400).json({ message: 'Cannot drop, object not found' });
        }
      } else {
        res.status(400).json({ message: 'Id cannot be null' });
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

      if (id) {
        const result = await Log.update(
          { toArchive: true },
          {
            where: {
              id,
            },
          }
        );

        if (result) {
          res.status(200).json({ message: 'Archived successfully' });
        } else {
          res.status(400).json({ message: 'Cannot drop, object not found' });
        }
      } else {
        res.status(400).json({ message: 'Id cannot be null' });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        stack: error,
      });
    }
  }
}

export default new LogController();
