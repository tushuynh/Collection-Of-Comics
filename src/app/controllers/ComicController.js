const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../../util/mongoose');
const fs = require('fs');

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
            .catch(next);
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
}

module.exports = new ComicsController();
