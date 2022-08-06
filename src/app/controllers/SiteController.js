const userSchema = require('../models/user');

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

        if (username && password) {
            userSchema
                .findOne({ username, password })
                .then((doc) => {
                    if (doc) {
                        req.session.user = doc;
                        res.redirect('/comics');
                    } else
                        return console.log('Username or password is invalid');
                })
                .catch(next);
        } else return console.log('Username or password is invalid');
    }
}

module.exports = new SiteController();
