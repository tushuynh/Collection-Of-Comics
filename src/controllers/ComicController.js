const axios = require('axios');
const cheerio = require('cheerio');

const comicSchema = require('../models/comic');
const { comicsMongooseToObject } = require('../utils/mongoose');
const { removeAccents } = require('../utils/helper');

class ComicController {
  // ------------------------------------------------------------------------- [GET]
  // [GET] /comics
  // Home page show all comics
  showHomepage(req, res, next) {
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

  // [GET] /updateNewChapter
  // Craw to update new chapter of all comics
  async updateNewChapter(req, res, next) {
    const errorCrawlComics = [];

    const comics = await comicSchema.find();

    // Parallel
    // await Promise.all(
    //   comics.map(async (comic) => {
    //     const comicName = removeAccents(comic.name.toLowerCase())
    //       .split(' ')
    //       .join('-');
    //     const url = process.env.WEB_CRAWL_URL + comicName;

    //     try {
    //       const response = await axios.get(url);
    //       const $ = cheerio.load(response.data);

    //       let chap = $('#list-chapter-comic a span').first().text();
    //       chap = chap.split(' ')[1]?.trim();
    //       // const imageURL = $('.col-image img').attr('src');

    //       if (!chap) {
    //         errorCrawlComics.push({
    //           comicName,
    //           url,
    //           message: 'Can not get new chapter',
    //         });
    //       } else if (Number(chap) && chap !== comic.chapPresent) {
    //         await comicSchema.updateOne(
    //           {
    //             name: comic.name,
    //           },
    //           {
    //             chapPresent: chap,
    //             // image: imageURL,
    //           }
    //         );
    //       }

    //       return { comicName, chap };
    //     } catch (error) {
    //       return errorCrawlComics.push({
    //         comicName,
    //         url,
    //         message: error?.message || '',
    //       });
    //     }
    //   })
    // );

    // Sequence (handle for rate limit)
    for (const comic of comics) {
      const comicName = removeAccents(comic.name.toLowerCase())
        .split(' ')
        .join('-');
      const url = process.env.WEB_CRAWL_URL + comicName;

      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let chap = $('#list-chapter-comic a span').first().text();
        chap = chap.split(' ')[1]?.trim();
        // const imageURL = $('.col-image img').attr('src');

        if (!chap) {
          errorCrawlComics.push({
            comicName,
            url,
            message: 'Can not get new chapter',
          });
        } else if (Number(chap) && chap !== comic.chapPresent) {
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
      } catch (error) {
        errorCrawlComics.push({
          comicName,
          url,
          message: error?.message || 'Something went wrong!',
        });
      }
    }

    return res.json({
      message: 'Craw new chapter of all comic finished',
      errorCrawComics: errorCrawlComics.map((error) => {
        const errorMessage = `[Comic crawl failed] - url: ${error.url} - message: ${error?.message}`;
        console.error(errorMessage);
        return errorMessage;
      }),
    });
  }

  // [GET] /testCrawl
  // Test crawl new chapter on production
  async testCrawl(req, res, next) {
    const errorCrawlComics = [];
    const comic = {
      name: 'Bắc Kiếm Giang Hồ',
      chapPresent: '187',
    };

    const comicName = removeAccents(comic.name.toLowerCase())
      .split(' ')
      .join('-');
    const url = process.env.WEB_CRAWL_URL + comicName;

    try {
      // const response = await axios.get(url)
      const response = await axios.get(url, {
        withCredentials: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
      });
      const $ = cheerio.load(response.data);

      let chap = $('#list-chapter-comic a span').first().text();
      chap = chap.split(' ')[1]?.trim();
      // const imageURL = $('.col-image img').attr('src');

      if (!chap) {
        errorCrawlComics.push({
          comicName,
          url,
          message: 'Can not get new chapter',
        });
      } else if (Number(chap) && chap !== comic.chapPresent) {
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
    } catch (error) {
      console.error(`Can not crawl new chapter`);
      console.error(error);
      console.error(`Can not crawl new chapter`);
      errorCrawlComics.push({
        comicName,
        url,
        message: error?.message || 'Something went wrong!',
      });
    }

    return res.json({
      message: 'Craw new chapter of all comic finished',
      errorCrawComics: errorCrawlComics.map((error) => {
        const errorMessage = `[Comic crawl failed] - url: ${error.url} - message: ${error?.message}`;
        // console.error(errorMessage);
        return errorMessage;
      }),
    });
  }

  // ---------------------------------------------------------------- [POST]
  // [POST] /comics
  createComic(req, res, next) {
    req.body.userId = req.cookies.userId;
    const comic = comicSchema(req.body);
    comic
      .save()
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }

  // ---------------------------------------------------------------- [PUT]
  // [PUT] /comics/:_id
  updateComic(req, res, next) {
    const { _id } = req.params;
    req.body.lastRead = new Date();
    comicSchema
      .updateOne({ _id }, req.body)
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }

  // ---------------------------------------------------------------- [DELETE]
  // [DELETE] /comics/:_id
  deleteComic(req, res, next) {
    const { _id } = req.params;
    comicSchema
      .delete({ _id })
      .then(() => res.redirect('back'))
      .catch((err) => console.log('Error: ', err));
  }
}

module.exports = new ComicController();
