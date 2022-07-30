const userSchema = require('../models/user')
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

class SiteController {

    // [GET] /
    index(req, res) {
        res.render('login', { layout: false })
    }

    // [POST] /
    login(req, res, next) {
        const { username, password } = req.body

        if (username && password) {
            userSchema.findOne({ username, password })
                .then(doc => {
                    if (doc) {
                        localStorage.setItem('username', doc.username)
                        localStorage.setItem('id', doc._id)
                        res.redirect('/comics')
                    }
                    else
                        return console.log("Username or password is invalid")
                })
                .catch(next)
        }
        else
            return console.log("Username or password is invalid")
    }
}

module.exports = new SiteController