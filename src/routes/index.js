const sitesRouter = require('./siteRouter')
const comicsRouter = require('./comicRouter')
const authRouter = require('./authRouter')

function route(app) {
    
    app.use('/auth', authRouter)
    app.use('/comic', comicsRouter)
    app.use("/", sitesRouter)
    
}

module.exports = route