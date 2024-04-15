const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../utils/mongoose');
const { removeAccents } = require('../utils/helper');

class ComicController {
  // ------------------------------------------------------------------------- [GET]
  // [GET] /comics
  // Home page show all comics
  showComics(req, res, next) {
    comicSchema
      .find({
        userId: req.cookies.userId,
      })
      .sort({ lastRead: 1 })
      .then((comics) => {
        res.render('pages/comic', {
          name: req.cookies.name,
          comics: comicsMongooseToObject(comics),
        });
      })
      .catch((err) => console.log(err));
  }

  // [GET] /getComics
  // Get all comics
  getComics(req, res, next) {
    comicSchema
      .find()
      .sort({ lastRead: 1 })
      .then((comics) => res.json(comics))
      .catch((err) => res.json(err));
  }

  // [GET] /crawNewChapter
  // Craw to update new chapter of all comics
  async crawNewChapter(req, res, next) {
    const errorCrawlComics = [];

    const comics = await comicSchema.find();
    await Promise.all(
      comics.map(async (comic) => {
        const comicName = removeAccents(comic.name.toLowerCase())
          .split(' ')
          .join('-');
        const url = process.env.WEB_CRAWL_URL + comicName;
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });

        try {
          const response = await axios.get(url, { httpsAgent });
          const $ = cheerio.load(response.data);

          let chap = $('.list-chapter a').first().text();
          chap = chap.split(' ')[1].trim();
          // const imageURL = $('.col-image img').attr('src');

          if (Number(chap) && chap !== comic.chapPresent) {
            await comicSchema.updateOne(
              {
                name: comic.name,
              },
              {
                chapPresent: chap,
                // image: imageURL,
              }
            );
          }

          return { comicName, chap };
        } catch (error) {
          return errorCrawlComics.push({
            comicName,
            url,
            message: error?.message || '',
          });
        }
      })
    );

    return res.json({
      message: 'Craw new chapter of all comic finished',
      errorCrawComics: errorCrawlComics.map((error) => {
        const errorMessage = `[Comic crawl failed] - Comic's name: ${error.comicName} - url: ${error.url} - message: ${error?.message}`;
        console.error(errorMessage);
        return errorMessage;
      }),
    });
  }

  // ---------------------------------------------------------------- [POST]
  // [POST] /comics/create
  createComic(req, res, next) {
    req.body.userId = req.cookies.userId;
    const comic = comicSchema(req.body);
    comic
      .save()
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }

  // ---------------------------------------------------------------- [PUT]
  // [PUT] /comics/update/:_id
  updateComic(req, res, next) {
    const { _id } = req.params;
    req.body.lastRead = new Date();
    comicSchema
      .updateOne({ _id }, req.body)
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }

  // ---------------------------------------------------------------- [DELETE]
  // [DELETE] /comics/delete/:_id
  deleteComic(req, res, next) {
    const { _id } = req.params;
    comicSchema
      .delete({ _id })
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }
}

module.exports = new ComicController();
