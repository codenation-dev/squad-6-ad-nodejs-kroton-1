import Log from '../models/User'
import { Op } from 'sequelize'

class LogController {

  async searchLog(req, res) {
    const { options, countOptions } = this.buildSearch(req)

    const results = await Log.findAll(options)
    const total = (await Log.findAll(countOptions)).length

    const limit = options['limit']
    const offset = options['offset']
    
    const meta = this.buildMeta(req, limit, offset, total)

    return res.status(200).json({ meta, results });
  }

  async remove(req, res) {
    return res.json({ message: 'remoce error' });
  }

  async toArchive(req, res) {
    return res.json({ message: 'archieve error' });
  }

  buildSearch(req) {
    const environment = req.query.env
    const sortBy = req.query.sortBy
    const sortOrder = req.query.sortOrder || 'DESC'
    const queryField = req.query.queryBy
    const queryValue = req.query.queryValue

    const limit = req.query.limit || 100
    const offset = req.query.offset || 0

    const options = {}
    const countOptions = {}

    if (environment) {
      options['where'] = { environment }
      countOptions['where'] = { environment }
    }

    if (sortBy) {
      options['order'] = [sortBy, sortOrder]
      countOptions['order'] = [sortBy, sortOrder]
    }

    if (queryField) {
      options['where'] = {
        ...options['where'],

        queryField: {
          [Op.like]: `%${queryValue}%`
        }
      }

      countOptions['where'] = {
        ...options['where'],

        queryField: {
          [Op.like]: `%${queryValue}%`
        }
      }
    }

    options['limit'] = limit
    options['offset'] = offset

    return { options, countOptions }
  }

  buildMeta(req, limit, offset, total) {
    const host = req.headers['host']
    const base = req.originalUrl.split('?')[0]
    const query = req.query

    const toIgnore = ['limit', 'offset'];

    const queries = Object.keys(query)
      .filter(key => !toIgnore.includes(key))
      .reduce((obj, key) => {
        obj.push(`${key}=${query[key]}`);
        return obj;
      }, []);

    if ((limit + offset) <= total) {
      meta['next'] = `${host}${base}?${queries.join('&')}&limit=${limit}&offset=${limit + offset}`
    }
    if (offset > 0 && (offset - limit) >= 0) {
      meta['previous'] = `${host}${base}?${queries.join('&')}&limit=${limit}&offset=${offset - limit}`
    }
    meta['total'] = total

    return meta
  }

}

export default new LogController();
