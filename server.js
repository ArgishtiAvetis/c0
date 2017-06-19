// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');
var Challenge = require('./app/models/challenge');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(path.join(__dirname, 'public')));

// required for passport
//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(session({
    secret: 'erazimerkirhayrenihogerdshathuysdmets',
    name: 'none-of-your-business-haha',
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.get('/googled6ab2d2a2c5cc94e.html', (req, res) => {
  res.render('google');
});

app.get('/api/challenges/all', (req, res) => {
  Challenge.find({})
    .exec((err, challenges) => {
      if (err) {
        res.send("Error has occured");
      } else {
        res.json(challenges);
      }
    });
});

app.get('/api/challenges/:user_id', (req, res) => {
  Challenge.find({
    author_id: req.params.user_id
  })
    .exec((err, challenges) => {
      if (err) {
        res.send("Error has occured");
      } else {
        res.json(challenges);
      }
    });
});

app.get('/api/challenge/:id', (req, res) => {
  Challenge.findOne({
    _id: req.params.id
  })
  .exec((err, challenge) => {
    if (err) {
      res.send("An error has occured");
    } else {
      res.json(challenge);
    }
  });
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
