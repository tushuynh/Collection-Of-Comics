const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// ---------------------------------------------------------------- [GET]
// Google OAuth2
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    authController.oauth2CallBack
);

// Facebook OAuth2
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}))
router.get(
    '/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/' }),
    authController.oauth2CallBack
)

router.get('/logout', authController.logout)
// ---------------------------------------------------------------- [POST]
router.post('/login', authController.login)



module.exports = router;
