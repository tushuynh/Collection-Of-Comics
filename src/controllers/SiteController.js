const userSchema = require('../models/user');
const { signAccessToken} = require('../utils/jwtService')

class SiteController {
    // ---------------------------------------------------------------- [GET]
    // [GET] /
    index(req, res, next) {
        if (!req.payload) {
            return res.render('pages/login', { layout: false });
        }
        res.redirect('/comic');
    }

    // ---------------------------------------------------------------- [POST]
    // [POST] /register
    register(req, res, next) {
        const { name, username, password } = req.body;
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be more than 6 characters.',
            });
        }

        const user = new userSchema({ name, username, password})
        user.save()
            .then(user => {
                res.status(200).json({
                    message: 'Account created successfully.',
                    user,
                });
            })
            .catch((err) =>
                res.status(400).json({
                    message: 'An error occurred',
                    error: err.message,
                })
            );
    }
}

module.exports = new SiteController();
