require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const db = require('./src/configs/dbConfig');
const route = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
require('./src/services/passport');

const app = express();
const port = process.env.PORT || 3000;

db.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); // Override method in HTML(only GET & POST)
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: true,
      sameSite: true,
      maxAge: 600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1);

// Config handlebars
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// app.use((req, res, next) => {
//     console.log(`Incomming - Protocol: [${req.protocol}] - Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)
//     next()
// })

route(app);
errorHandler(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
