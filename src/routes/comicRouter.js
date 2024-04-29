const express = require('express');
const router = express.Router();
const comicController = require('../controllers/ComicController');

// ---------------------------------------------------------------- [GET]
router.get('/updateNewChapter', comicController.updateNewChapter);
router.get('/getComics', comicController.getComics);
router.get('/', comicController.showHomepage);

// ---------------------------------------------------------------- [POST]
router.post('/', comicController.createComic);

// ---------------------------------------------------------------- [PUT]
router.put('/:_id', comicController.updateComic);

// ---------------------------------------------------------------- [DELETE]
router.delete('/:_id', comicController.deleteComic);

module.exports = router;
