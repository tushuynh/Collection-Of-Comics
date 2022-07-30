const comicSchema = require('../models/comic')
const { comicsMongooseToObject, comicToObject } = require('../../util/mongoose')
const { removeAccents, getUserLocalStorage } = require('../../util/tool')
const fs = require('fs')

class ComicsController {

    // [GET] /:id/comics
    showComics(req, res, next) {
        comicSchema.find({
            userId: getUserLocalStorage().id,
            status: { $in: ['hot', 'none'] }
        })
            .sort({ lastRead: 1 })
            .then(comics => res.render('comics', {
                user: getUserLocalStorage(),
                comics: comicsMongooseToObject(comics)
            }))
            .catch(next)
    }

    // [POST] /comics/create
    createComic(req, res, next) {
        req.body.userId = getUserLocalStorage().id
        const comic = comicSchema(req.body)
        comic.save()
            .then(() => res.redirect('/comics'))
            .catch(next)
    }

    // [GET] /comics/:id/update/:comicId
    showEditComic(req, res, next) {
        const { comicId }= req.params
        comicSchema.findById(comicId)
            .then(comic => res.render('comics', {
                user: getUserLocalStorage(),
                showEditModal: 'modal-show',
                comic: comicToObject(comic)
            }))
            .catch(next)
    }

    // [PUT] /comics/:id/update/:comicId
    updateComic(req, res, next) {
        req.body.lastRead = new Date()
        comicSchema.updateOne(
            { _id: req.params.comicId },
            req.body,
        )
            .then(() => res.redirect('/comics'))
            .catch(next)
    }

    // [GET] /comics/:id/delete/:comicId
    showConfirmDelete(req, res, next) {
        const { comicId } = req.params
        comicSchema.findById(comicId)
            .then(comic => res.render('comics', {
                user: getUserLocalStorage(),
                showDeleteModal: 'modal-show',
                comic: comicToObject(comic)
            }))
            .catch(next)
    }

    // [DELETE] /comics/:id/delete/:comicId
    deleteComic(req, res, next) {
        comicSchema.deleteOne({ _id: req.params.comicId })
            .then(() => res.redirect('/comics'))
            .catch(next)
    }

    // [GET] /comics/:id/:type
    searchComicsOfType(req, res, next) {
        const { type } = req.params

        switch (type) {
            case 'hot':
            case 'end':
            case 'blackList':
            case 'drop':
                comicSchema.find({
                    userId: getUserLocalStorage().id,
                    status: type
                })
                    .sort({ lastRead: 1 })
                    .then(comics => {
                        comics = comicsMongooseToObject(comics)
                        res.render('comics', {
                            user: getUserLocalStorage(),
                            comics 
                        })
                    })
                    .catch(next)
                break;
            default:
                comicSchema.find({
                    type,
                    userId: getUserLocalStorage().id,
                    status: { $in: ['hot', 'none'] }
                })
                    .sort({ lastRead: 1 })
                    .then(comics => {
                        comics = comicsMongooseToObject(comics)
                        res.render('comics', {
                            user: getUserLocalStorage(),
                            comics 
                        })
                    })
                    .catch(next)
                break;
        }
    }

    // [GET] /comics/:id/search
    searchComics(req, res, next) {
        const name = req.query.name
        comicSchema.find({
            userId: getUserLocalStorage().id,
            status: { $in: ['hot', 'none']}
        })
            .then(comics => {
                comics = comicsMongooseToObject(comics)
                comics = comics.filter(comic => {
                    return removeAccents(comic.name.toUpperCase()).includes(removeAccents(name.toUpperCase()))
                })
                res.render('comics', {
                    user: getUserLocalStorage(),
                    comics
                })
            })
            .catch(next)
    }

    // [GET] /comics/saveComics
    // Read and save all comics from file .txt (Array object in file .txt)
    saveComics(req, res) {
        // fs.readFile(process.cwd() + "/src/public/backupComics.txt", "utf8", (err, file) => {
        //     if (err) {
        //         console.log(err)
        //         return
        //     }

        //     let arg = file.split("},")
        //     let arrComics = []
        //     for (let i = 0; i < arg.length; i++) {
        //         let comic = {
        //             userId: '62daa900ec205bbcfa8b2f23',
        //             name: arg[i].split('"name": "')[1].split('",')[0],
        //             chap: arg[i].split('"chap": "')[1].split('",')[0],
        //             type: arg[i].split('"type": "')[1].split('",')[0],
        //             image: arg[i].split('"image": "')[1].split('",')[0],
        //             lastRead: new Date((arg[i].split('"lastRead": "')[1].split('",')[0]).split("/").reverse().join("-")),
        //             status: arg[i].split('"status": "')[1].split('",')[0],
        //         }
        //         arrComics.push(comic)

        //         // comic.save()
        //         //     .then()
        //         //     .catch(err => console.log(err))
        //     }
        //     res.json(arrComics)
        // })
    }
}

module.exports = new ComicsController