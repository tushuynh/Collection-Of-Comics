const jwt = require('jsonwebtoken')

const signAccessToken = (payload) => {
    return new Promise( (resolve, reject) => {
        const accessKey = process.env.ACCESS_KEY
        const options = {
            expiresIn: '7d' // 1 week
        }

        jwt.sign(payload, accessKey, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    const accessKey = process.env.ACCESS_KEY
    const token = req.cookies.accessToken
    jwt.verify(token, accessKey, (err, decode) => {
        req.payload = decode
        if (err) req.payload = null
        next()
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}