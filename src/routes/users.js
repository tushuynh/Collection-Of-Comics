const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')

router.get('/find', userController.find)
router.get('/deleteAll', userController.delete)

module.exports = router