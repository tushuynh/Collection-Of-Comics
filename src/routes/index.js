const sitesRouter = require('./sites')
const comicsRouter = require('./comics')

function route(app) {
    
    app.use('/comics', comicsRouter)
    app.use("/", sitesRouter)
    
}

module.exports = route