const moment = require('moment')

module.exports = {
    comicsMongooseToObject: (array) => {
        array = array.map(doc => doc.toObject())
        array.filter(comic => {
            comic.lastRead = moment(comic.lastRead).format('DD/MM/YYYY')
        })
        return array
    },
    comicToObject: (comic) => {
        if (comic) {
            comic = comic.toObject()
            comic.lastRead = moment(comic.lastRead).format('DD/MM/YYYY')
        }
        return comic
    },
    multipleMongooseToObject: (array) => {
        return array.map(doc => doc.toObject())
    },
    mongooseToObject: (doc) => {
        return doc ? doc.toObject(): doc
    }
}