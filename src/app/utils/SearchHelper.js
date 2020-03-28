const { Op } = require('sequelize');

const buildSearch = async req => {
  console.log({ query: req.query });

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

module.exports = { buildSearch, buildMeta };
