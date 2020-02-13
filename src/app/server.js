const express = require('express')
const app = express()

const userRouters = require('../router/user')

app.use(express.json())

app.use('/v1/users', userRouters)

module.exports = app