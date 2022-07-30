const mongoose = require('mongoose')
const MONGO_URI = "mongodb+srv://admin:admin@comiccollection.vhq97dj.mongodb.net/ComicCollection?retryWrites=true&w=majority"

async function connect() {
    
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Connected to database...')
    } catch (error) {
        console.log('Connect failure!')
    }
}

module.exports = { connect }