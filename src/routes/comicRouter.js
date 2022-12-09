const express = require('express');
const router = express.Router();
const comicController = require('../controllers/ComicController');

// ---------------------------------------------------------------- [GET]
router.get('/getComics', comicController.getComics)
router.get('/crawlChapPresent', comicController.crawlChapPresent)
router.get('/', comicController.showComics);

// ---------------------------------------------------------------- [POST]
router.post('/create', comicController.createComic);

// ---------------------------------------------------------------- [PUT]
router.put('/update/:_id', comicController.updateComic);

// ---------------------------------------------------------------- [DELETE]
router.delete('/delete/:_id', comicController.deleteComic);


module.exports = router;