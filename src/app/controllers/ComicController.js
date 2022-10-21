const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../../util/mongoose');
const helper = require('../../util/helper')
const axios = require('axios')
const cheerio = require('cheerio')


class ComicsController {
    // [GET] /comics
    showComics(req, res, next) {
        comicSchema
            .find({
                userId: req.session.user._id,
            })
            .sort({ lastRead: 1 })
            .then((comics) => {
                res.render('comics', {
                    user: req.session.user,
                    comics: comicsMongooseToObject(comics),
                });
            })
            .catch(next);
    }

    // [POST] /comics/create
    createComic(req, res, next) {
        req.body.userId = req.session.user._id;
        const comic = comicSchema(req.body);
        comic
            .save()
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PUT] /comics/update/:comicId
    updateComic(req, res, next) {
        req.body.lastRead = new Date();
        comicSchema
            .updateOne({ _id: req.params.comicId }, req.body)
            .then(() => res.redirect('back'))
            .catch(err => console.log('error: ', err));
    }

    // [DELETE] /comics/delete/:comicId
    deleteComic(req, res, next) {
        comicSchema
            .delete({ _id: req.params.comicId })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [GET] /comics/logout
    logout(req, res, next) {
        req.session.destroy();
        res.redirect('/');
    }

    // [GET] /comics/crawlChapPresent
    crawlChapPresent(req, res, next) {
        comicSchema
            .find()
            .then(comics => {
                console.log(comics.length)
                comics.forEach(comic => {
                    const comicName = helper.removeAccents(comic.name.toUpperCase()).split(' ').join('-')
                    const url = 'http://nhattruyenone.com/truyen-tranh/' + comicName
                    axios.get(url)
                        .then((response) => {
                            const $ = cheerio.load(response.data)
                            let chap = $('.chapter').first().text().split(' ')[1].toString()
                            chap = chap.slice(0, chap.length - 1)
                            
                            comicSchema
                                .updateOne({
                                    name: comic.name
                                }, {
                                    chapPresent: chap
                                })
                                .then(data => next)
                                .catch(err => res.json(err))
                        })
                        .catch(err => res.json(err))
                })
                console.log('All updated!')
            })
            .catch(next);
    }

    // [GET] /getComics
    getComics(req, res, next) {
        comicSchema
            .find()
            .sort({ lastRead: 1})
            .then(comics => res.json(comics))
            .catch(next)
    }

    
}

module.exports = new ComicsController();
