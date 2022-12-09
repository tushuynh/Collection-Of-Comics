const sitesRouter = require('./siteRouter')
const comicsRouter = require('./comicRouter')

function route(app) {
    
    app.use('/comic', comicsRouter)
    app.use("/", sitesRouter)
    
}

module.exports = route