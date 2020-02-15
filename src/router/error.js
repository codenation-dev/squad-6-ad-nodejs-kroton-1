const express = require('express')
const router = express.Router()

const { searchError, remove, toArchive } = require('../controller/error')

router.post('/', searchError)

router.post('/remove', remove)

router.post('/archive', toArchive)

module.exports = router