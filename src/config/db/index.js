const mongoose = require('mongoose')


async function connect(MONGO_URI) {
    
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Connected to database...')
    } catch (error) {
        console.log('Connect failure!')
    }
}

module.exports = { connect }