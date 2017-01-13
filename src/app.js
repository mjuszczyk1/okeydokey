/** Gonna leave myself some notes fer later... I'll need em..
 * make sure mongo is running (mongod)
 *      I had to run as sudo for some reason at work - probably because of where my data/db/ folder is.
 * run using nodemon
 *
 * The way I see the flow of this
 *  nodemon runs this file, which sets up our app and db connection
 *  this file also sets up the app to use Pug as the view engine
 *  this file pulls in the routes for our app, and listens on the port.
 *  Go to routes/index.js for next flow notes
 * 
 * Need to learn sessions so I can actually stay logged in and whatnot afterwards
 */


const express    = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      routes     = require('./routes/index.js'),
      session    = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      port       = 3000;

const app = express(); // Makes a new app

// mongo connection
mongoose.connect("mongodb://localhost:27017/okeydokey");
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error: '));

// Once session is created, you can grab it from the req obj on routes.
app.use(session({
    secret: 'asldkfj owif237* (*&_837odjf/',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// make user ID avaialbe in templates
app.use((req,res,next) => {
    res.locals.currentUser = req.session.userId;
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set view engine:
app.set('view engine', 'pug');//basically sets the extension we will be using for view files
app.set('views', __dirname + '/views');//directory of view files

app.use('/', routes);// add routes to app

//Error handler
app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});