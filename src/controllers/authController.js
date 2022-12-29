const userSchema = require('../models/user');
const { signAccessToken} = require('../utils/jwtService')

class AuthController {

    // [GET] /auth/google/callback && /auth/facebook/callback
    async oauth2CallBack(req, res, next) {
        const user = req.user

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
    }

    // [GET] /auth/logout
    // Logout to login page
    logout(req, res, next) {
        res.clearCookie('name')
        res.clearCookie('userId')
        res.clearCookie('accessToken')
        res.redirect('/');
    }

    // [POST] /auth/login
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
                    return res.render('pages/login', {
                        loginError: 'Username is not found.',
                        layout: false
                    })
                }

                user.comparePassword(password, async (err, isMatch) => {
                    if (err) {
                        console.log(err)
                        return res.redirect('/');
                    }

                    if (!isMatch) {
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
                })
            })
            .catch((err) => {
                console.log(err)
                res.redirect('/');
            });
    }
}

module.exports = new AuthController();
