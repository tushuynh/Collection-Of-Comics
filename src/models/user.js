const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    googleID: {
        type: String,
        unique: true
    },
    facebookID: {
        type: String,
        unique: true
    }
})

userSchema.pre('save', function(next) {
    const user = this
    if (!user.isModified('password')) return next()

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err)

        user.password = hash
        next()
    })
})

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

module.exports = mongoose.model("User", userSchema)