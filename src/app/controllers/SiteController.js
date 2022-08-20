const userSchema = require('../models/user');
const bcrypt = require('bcryptjs');

class SiteController {
    // [GET] /
    index(req, res) {
        if (req.session.user) {
            res.redirect('/comics');
        } else {
            res.render('login', { layout: false });
        }
    }

    // [POST] /
    login(req, res, next) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username or Password not present',
            });
        }

        userSchema
            .findOne({ username })
            .then((user) => {
                if (!user) {
                    res.status(400).json({
                        message: 'Login not successful',
                        error: 'Username not found',
                    });
                } else {
                    // comparing given password with hashed password
                    bcrypt.compare(password, user.password).then((result) => {
                        if (result) {
                            req.session.user = user;
                            res.redirect('/comics');
                        } else {
                            res.status(400).json({
                                message: 'Password not correct',
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(400).json({
                    message: 'An error occurred',
                    error: error.message,
                });
            });
    }

    register(req, res, next) {
        const { name, username, password } = req.body;

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password less than 6 characters',
            });
        }

        bcrypt.hash(password, 10).then(async (hash) => {
            await userSchema
                .create({
                    name,
                    username,
                    password: hash,
                })
                .then((user) => {
                    res.status(200).json({
                        message: 'User successfully created',
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
