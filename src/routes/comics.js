const express = require('express')
const router = express.Router()
const comicController = require('../app/controllers/ComicController')

// router.get('/saveComics', comicController.saveComics)

router.delete('/delete/:comicId', comicController.deleteComic)
router.get('/delete/:comicId', comicController.showConfirmDelete)
router.put('/update/:comicId', comicController.updateComic)
router.get('/update/:comicId', comicController.showEditComic)
router.post('/create', comicController.createComic)
router.get('/search', comicController.searchComics)
router.get('/:type', comicController.searchComicsOfStatus)
router.get('/', comicController.showComics)










module.exports = router