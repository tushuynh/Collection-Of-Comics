const express = require('express');
const router = express.Router();
const comicController = require('../controllers/ComicController');

// ---------------------------------------------------------------- [GET]
router.get('/crawNewChapter', comicController.crawNewChapter);
router.get('/getComics', comicController.getComics);
router.get('/', comicController.showComics);

// ---------------------------------------------------------------- [POST]
router.post('/create', comicController.createComic);

// ---------------------------------------------------------------- [PUT]
router.put('/update/:_id', comicController.updateComic);

// ---------------------------------------------------------------- [DELETE]
router.delete('/delete/:_id', comicController.deleteComic);

module.exports = router;
