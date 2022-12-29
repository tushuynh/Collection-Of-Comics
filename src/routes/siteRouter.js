const express = require('express')
const router = express.Router()
const siteController = require('../controllers/SiteController')
const { verifyAccessToken} = require('../utils/jwtService')

// ---------------------------------------------------------------- [GET]
router.get('/', verifyAccessToken, siteController.index)

// ---------------------------------------------------------------- [POST]
router.post('/register', siteController.register)

module.exports = router