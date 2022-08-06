const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../../util/mongoose');
const fs = require('fs');
const { stringify } = require('querystring');
const { json } = require('express');

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
            .then(() => res.redirect('/comics'))
            .catch(next);
    }

    // [PUT] /comics/update/:comicId
    updateComic(req, res, next) {
        req.body.lastRead = new Date();
        comicSchema
            .updateOne({ _id: req.params.comicId }, req.body)
            .then(() => res.redirect('/comics'))
            .catch(next);
    }

    // [DELETE] /comics/delete/:comicId
    deleteComic(req, res, next) {
        comicSchema
            .deleteOne({ _id: req.params.comicId })
            .then(() => res.redirect('/comics'))
            .catch(next);
    }

    // [GET] /comics/logout
    logout(req, res, next) {
        req.session.destroy();
        res.redirect('/');
    }

    // [GET] /comics/find
    backupComics(req, res, next) {
        comicSchema.find()
        .then(comics => {
            try {
                fs.writeFileSync('./src/public/backupComics.txt', JSON.stringify(comics), 'utf-8')
                res.json('Backup successfully!')
            } catch (error) {
                res.json('Error: ', error)
            }
            
        })
        .catch(next)
    }

    // [GET] /comics/saveComics
    // Read and save all comics from file .txt (Array object in file .txt)
    saveComics(req, res) {
        fs.readFile(process.cwd() + "/src/public/backupComics.txt", "utf8", (err, file) => {
            if (err) {
                console.log(err)
                return
            }
            let arg = file.split("},")
            let arrComics = []
            for (let i = 0; i < arg.length; i++) {
                let comic = {
                    userId: '62daa900ec205bbcfa8b2f23',
                    name: arg[i].split('"name":"')[1].split('",')[0],
                    chap: arg[i].split('"chap":"')[1].split('",')[0],
                    type: arg[i].split('"type":"')[1].split('",')[0],
                    image: arg[i].split('"image":"')[1].split('",')[0],
                    lastRead: new Date((arg[i].split('"lastRead":"')[1].split('",')[0]).split("/").reverse().join("-")),
                    status: arg[i].split('"status":"')[1].split('",')[0],
                }
                arrComics.push(comic)
                // comic.save()
                //     .then()
                //     .catch(err => console.log(err))
            }
            res.json(arrComics)
        })
    }
}

module.exports = new ComicsController();
