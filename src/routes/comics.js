const express = require('express');
const router = express.Router();
const comicController = require('../app/controllers/ComicController');

router.get('/getComics', comicController.getComics)
router.get('/crawlChapPresent', comicController.crawlChapPresent)
router.get('/logout', comicController.logout)
router.delete('/delete/:comicId', comicController.deleteComic);
router.put('/update/:comicId', comicController.updateComic);
router.post('/create', comicController.createComic);
router.get('/', comicController.showComics);

module.exports = router;