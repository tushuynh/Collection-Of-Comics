const errorHandler = (app) => {

    // Catching 404 error
    app.use((req, res, next) => {
        res.render('pages/notFound', {
            layout: false
        })
    })
}

module.exports = errorHandler