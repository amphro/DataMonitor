
/**
 * Load everything we need for the web server, including the db,
 * users, and routes.
 */

var express  = require('express');
var app      = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('../config/database.js');

// connect to our database
mongoose.connect(configDB.url);

// pass passport for configuration
require('../config/passport')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// allow loading of static files in the public folder
app.use("/", express.static(__dirname + '/../public'));

// required for passport
app.use(session({ secret: process.env.SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes -- load our routes with the app and fully configured passport
require('./routes.js')(app, passport);

module.exports = require('http').Server(app);
