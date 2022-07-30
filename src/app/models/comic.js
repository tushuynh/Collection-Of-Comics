const mongoose = require("mongoose")

const reqStr = {
    type: String,
    required: true,
    default: ""
}

const comicSchema = new mongoose.Schema({
    userId: reqStr,
    name: reqStr,
    chap: reqStr,
    type: reqStr,
    image: reqStr,
    lastRead: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: reqStr
})

module.exports = mongoose.model("Comic", comicSchema)