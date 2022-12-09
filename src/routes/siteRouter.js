const express = require('express')
const router = express.Router()
const siteController = require('../controllers/SiteController')
const { verifyAccessToken} = require('../utils/jwtService')

// ---------------------------------------------------------------- [GET]
router.get('/', verifyAccessToken, siteController.index)
router.get('/logout', siteController.logout)

// ---------------------------------------------------------------- [POST]
router.post('/login', siteController.login)
router.post('/register', siteController.register)

module.exports = router