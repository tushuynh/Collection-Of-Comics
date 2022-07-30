const userSchema = require('../models/user')

class UsersController {

    // [GET] /users/find
    find(req, res) {
        userSchema.find()
        .then(doc => res.json(doc))
        .catch(err => res.json({ Error: err}))
    }

    // [GET] /users/deleteAll
    delete(req, res) {
        userSchema.deleteMany()
            .then(res.json({ Message: "Deleted all users" }))
            .catch(err => res.json({ Error: err }))
    }
}

module.exports = new UsersController