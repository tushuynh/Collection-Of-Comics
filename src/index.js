const express = require('express');
require('dotenv').config();
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const route = require('./routes');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI =
    'mongodb+srv://admin:admin@comiccollection.vhq97dj.mongodb.net/ComicCollection?retryWrites=true&w=majority';

// Connect to database
db.connect(MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); // Override method in HTML(only GET & POST)
// Config session and store session in database
app.use(
    session({
        secret: 'sssshhhhhhhh',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 604800000,
        },
        store: MongoStore.create({ mongoUrl: MONGO_URI }),
    })
);

// Config handlebars
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//route init
route(app);

app.listen(port, () => console.log(`App listening on port ${port}...`));
