const express = require('express')
const app = express()

const userRouters = require('../router/user')
const errorRouters = require('../router/error')

app.use(express.json())

app.use('/v1/users', userRouters)
app.use('/v1/errors', errorRouters)

module.exports = app