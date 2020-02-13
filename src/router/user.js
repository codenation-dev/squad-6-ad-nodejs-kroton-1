const express = require('express')
const router = express.Router()

const { createUser, forgetPassword, login } = require('../controller/user')

router.post('/', createUser)

router.post('/forget', forgetPassword)

router.post('/login', login)

module.exports = router