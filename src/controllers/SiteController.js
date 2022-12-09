const bcrypt = require('bcryptjs');
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

    // [GET] /logout
    // Logout to login page
    logout(req, res, next) {
        res.clearCookie('name')
        res.clearCookie('userId')
        res.clearCookie('accessToken')
        res.redirect('/');
    }

    // ---------------------------------------------------------------- [POST]
    // [POST] /
    login(req, res, next) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.render('pages/login', {
                loginError: 'Username and password are required.',
                layout: false
            })
        }

        userSchema
            .findOne({ username })
            .then((user) => {
                if (!user) {
                    res.render('pages/login', {
                        loginError: 'Username is not found.',
                        layout: false
                    })
                }

                // comparing given password with hashed password
                bcrypt.compare(password, user.password).then(async (result) => {
                    if (!result) {
                        return res.render('pages/login', {
                            loginError: 'Password is incorrect.',
                            layout: false
                        })
                    }

                    const token = await signAccessToken({
                        userId: user._id
                    })
                    res.cookie('name', user.name)
                    res.cookie('accessToken', token, {
                        httpOnly: true,
                        secure: (process.env.NODE_ENV === 'development') ? false : true
                    })
                    res.cookie('userId', user.id, {
                        httpOnly: true,
                        secure: (process.env.NODE_ENV === 'development') ? false : true
                    })
                    res.redirect('/comic');
                });
            })
            .catch((err) => {
                console.log(err)
                res.redirect('pages/login', { layout: false });
            });
    }

    // [POST] /register
    register(req, res, next) {
        const { name, username, password } = req.body;
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be more than 6 characters.',
            });
        }

        bcrypt.hash(password, 10).then(async (hash) => {
            userSchema.create({
                    name,
                    username,
                    password: hash,
                })
                .then((user) => {
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
        });
    }
}

module.exports = new SiteController();
