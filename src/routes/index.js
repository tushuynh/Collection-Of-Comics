const sitesRouter = require('./sites')
const usersRouter = require('./users')
const comicsRouter = require('./comics')

function route(app) {
    
    app.use("/users", usersRouter)
    app.use('/comics', comicsRouter)
    app.use("/", sitesRouter)
    
}

module.exports = route