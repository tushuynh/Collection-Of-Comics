const express = require("express")
require("dotenv").config()
const handlebars = require("express-handlebars")
const methodOverride = require('method-override')
const path = require('path')

const route = require("./routes")
const db = require('./config/db')

// Connect to database
db.connect()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        selectType: (selected, options) => {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        }
    }}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//route init
route(app)

app.listen(port, () => console.log(`App listening on port ${port}...`))