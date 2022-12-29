require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session')

const db = require('./src/configs/dbConfig');
const route = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler')
require('./src/services/passport')
// const scheduler = require('./src/services/schedule')

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
db.connect(process.env.MONGO_URI);

app.use(cors())
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
        secure: process.env.NODE_ENV === 'development' ? false : true,
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