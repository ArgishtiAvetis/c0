// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var fileUpload = require('express-fileupload');
var morgan = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var configDB = require('./config/database.js');

var Challenge = require('./app/models/challenge');
var User = require('./app/models/user');
var Idea = require('./app/models/idea');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(fileUpload());
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



// POST add a challenge
app.post('/add-challenge', (req, res) => {

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('category', 'Category is required').notEmpty();
  req.checkBody('type', 'Type is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    console.log(errors);
    // res.render('profile', isLoggedIn, {
    //   isAuth: true,
    //  errors: errors,
    //   user : req.user
    // });
  } else {
    
    var img0 = req.files.img0;
    var file0 = req.files.files_resources;

    var newChallenge = new Challenge({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      overview: req.body.overview.trim(),
      type: req.body.type.trim(),
      slug: req.body.title.trim().replace(/\s+/g, "-"),
      author_id: req.body.author_id.trim(),
      category: req.body.category.trim(),
      day_limit: req.body.day_limit.trim(),
      img0: img0.name,
      is_public: req.body.public_private,
      files_resources: file0.name,
      reward: req.body.reward,
      rewards_number: req.body.rewards_number
    });

    //var random = '121212';

    img0.mv(__dirname + '/public/uploads/c/' + img0.name, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('file moved successfully');
      }
    });

    file0.mv(__dirname + '/public/uploads/resources/c/' + file0.name, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('file moved successfully');
      }
    });

    newChallenge.save(function (err, newChallenge) {
      if (err) return console.error(err);
    });
    res.redirect('/profile');
  } 
});

app.post('/profile/edit-account', (req, res) => {
      let id = req.body.a_n;
      let name = req.body.name;
      let email = req.body.email;
      let country = req.body.country;
      let old_country = req.body.old_country;
      let old_img = req.body.old_img;
      
      let profile_picture = req.files.profile_picture;
      if (req.files.profile_picture) {
        
        profile_picture.mv(__dirname + '/public/uploads/u/' + profile_picture.name, function(err) {
          if (err) {
            console.log('Error ->>> ' + err);
          } else {
            console.log('file moved successfully');
          }
        });
      }

      User.update({
        _id: id
      }, {
        $set: {
          new_name: name,
          new_email: email,
          country: (country) ? country : old_country,
          img_url: (profile_picture) ? '/uploads/u/' + profile_picture.name : old_img
        }
      }, () => res.redirect('/profile/account'));
    });



app.post('/contribute', (req, res) => {

  var newIdea = new Idea({
    body: req.body.body.trim(),
    challenge_id: req.body.c_i.trim(),
    author_id: req.body.u_i.trim(),
  });

  newIdea.save(function (err, newIdea) {
    if (err) return console.error(err);
  });
  res.redirect('/profile/activity');

});

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

app.get('/api/users/all', (req, res) => {
  User.find({})
    .exec((err, users) => {
      if (err) {
        res.send("Error has occured");
      } else {
        res.json(users);
      }
    });
});

app.get('/api/user/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
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
