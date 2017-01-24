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
 */


const express    = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      UserRoutes = require('./src/routes/user.js'),
      SongRoutes = require('./src/routes/song.js'),
      SpotifyOut = require('./src/routes/spotify-out.js'),
      // SpotifyIn  = require('./src/routes/spotify-in.js'),
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
    secret: 'asldkfj owif237* (*&_837odjf/',// This can be anything. Protects cookies n stuff.
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({// instead of storing sessions in RAM, this will store it in a new db, so we can have a lotta active users.
        mongooseConnection: db
    })
}));

// make user ID avaialbe in templates
app.use((req,res,next) => {
    // res.locals will make variables available in template files.
    // It's simply accessed with something like...
    //      if currentUser
    // In this case of pug.
    res.locals.currentUser = req.session.userId;
    next();
});

app.use(bodyParser.json());// Parses info into JSON so we can use it in app.
app.use(bodyParser.urlencoded({extended: false}));
// ^^ Have to look up the urlencode method, but probably just makes sure there's no spaces or anything in the URL

// Set view engine:
app.set('view engine', 'pug');//basically sets the extension we will be using for view files
app.set('views', __dirname + '/src/views');//directory of view files
// Pretty print HTML, cause that's annoying.
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// Serve our public files
app.use(express.static(__dirname + '/public'));

app.use('/', UserRoutes);// add routes to app
app.use('/songs', SongRoutes);
app.use('/spotify/out', SpotifyOut);
// app.use('/spotify/in', SpotifyIn);

//Error handler
// Express knows it's an error handler because of order/amount of arguments.
// This, plus error.pug, will render error messages to the page, as opposed
// to just showing a stacktrace.
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