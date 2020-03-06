import Log from '../models/User'
import { Op } from 'sequelize'

class LogController {

  async searchLog(req, res) {
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

    const result = await Log.findAll(options)
    const total = await Log.findAll(countOptions)


    return res.json(result);
  }

  async remove(req, res) {
    return res.json({ message: 'remoce error' });
  }

  async toArchive(req, res) {
    return res.json({ message: 'archieve error' });
  }
}

export default new LogController();
