const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../utils/mongoose');
const { removeAccents} = require('../utils/helper')
const axios = require('axios')
const cheerio = require('cheerio')


class ComicController {

    // ------------------------------------------------------------------------- [GET]
    // [GET] /comics
    // Home page show all comics
    showComics(req, res, next) {
        comicSchema
            .find({
                userId: req.cookies.userId
            })
            .sort({ lastRead: 1 })
            .then((comics) => {
                res.render('pages/comic', {
                    name: req.cookies.name,
                    comics: comicsMongooseToObject(comics),
                });
            })
            .catch(err => console.log(err));
    }

    

    // [GET] /comic/crawlChapPresent
    // Get data of comics from web to store in database
    async crawlChapPresent(req, res, next) {
        // const comics = await comicSchema.find()
        // const response = await Promise.all(comics.map(async comic => {
        //     const comicName = removeAccents(comic.name.toUpperCase()).split(' ').join('-')
        //     console.log(process.env.WEB_CRAWL_URL)
        //     const url = process.env.WEB_CRAWL_URL + comicName
        //     try {
        //         const response = await axios.get(url)
        //         const $ = cheerio.load(response.data)

        //         // get chap present
        //         let chap = $('.chapter-item a').first().text()
        //         chap = chap.split(' ')[1]


        //         // get comic's image url
        //         // const imageURL = $('.col-image img').attr('src')

        //         await comicSchema
        //             .updateOne({
        //                 name: comic.name
        //             }, {
        //                 chapPresent: chap,
        //                 // image: imageURL
        //             })
        //         return { comicName, chap}
        //     } catch (error) {
        //         if (!error.config.url)
        //             return error.config.url
        //         return error
        //     }
        // }))

        // res.json({
        //     message: 'Finish update chap present for all comics',
        //     response
        // })
    }

    // [GET] /getComics
    // Get all comics
    getComics(req, res, next) {
        comicSchema
            .find()
            .sort({ lastRead: 1})
            .then(comics => res.json(comics))
            .catch(err => res.json(err))
    }

    // ---------------------------------------------------------------- [POST]
    // [POST] /comics/create
    createComic(req, res, next) {
        req.body.userId = req.cookies.userId;
        const comic = comicSchema(req.body);
        comic
            .save()
            .then(() => res.redirect('back'))
            .catch(err => console.log('Error: ', err));
    }

    // ---------------------------------------------------------------- [PUT]
    // [PUT] /comics/update/:_id
    updateComic(req, res, next) {
        const { _id} = req.params
        req.body.lastRead = new Date();
        comicSchema
            .updateOne({ _id}, req.body)
            .then(() => res.redirect('back'))
            .catch(err => console.log('Error: ', err));
    }

    // ---------------------------------------------------------------- [DELETE]
    // [DELETE] /comics/delete/:_id
    deleteComic(req, res, next) {
        const { _id} = req.params
        comicSchema
            .delete({ _id})
            .then(() => res.redirect('back'))
            .catch(err => console.log('Error: ', err));
    }
}

module.exports = new ComicController();
