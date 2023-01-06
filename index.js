require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const db = require('./src/configs/dbConfig');
const route = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler')
require('./src/services/passport')
// const scheduler = require('./src/services/schedule')

const app = express();
const port = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})


// Connect to database
db.connect(process.env.MONGO_URI);

if (process.env.NODE_ENV === 'production') {
    app.use(limiter)
}
app.use(helmet())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); // Override method in HTML(only GET & POST)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
        sameSite: true,
        maxAge: 600000
    }
}))
// app.set('trust proxy', 1)

// Config handlebars
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// route init
route(app);

// Error handler
errorHandler(app)

// config scheduler
// scheduler.crawlChapPresent()

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));