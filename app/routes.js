// app/routes.js
module.exports = function(app, passport) {
    var expressValidator = require('express-validator');

    var Challenge = require('./models/challenge');
    var User = require('./models/user');
    let isAuth;
    let errors = [];

    // =====================================
    // HOME PAGE ===========================
    // =====================================
    app.get('/', function(req, res) {
      isAuth = (req.isAuthenticated()) ? true : false;
      Challenge.find({})
        .exec((err, challenges) => {
          if (err) {
            res.send("Error has occured");
          } else {
            res.render('index', {
              challenges: challenges,
              isAuth: isAuth
            }); // load the index.ejs file
          }
        });

    });

    // =====================================
    // CHALLENGES PAGE =====================
    // =====================================

    app.get('/challenges', function(req, res) {
      isAuth = (req.isAuthenticated()) ? true : false;
      Challenge.find({})
        .exec((err, challenges) => {
          if (err) {
            res.send("Error has occured");
          } else {
            res.render('challenges', {
              challenges: challenges,
              isAuth: isAuth
            });
          }
        });
    });

    // =====================================
    // SINGLE CHALLENGE PAGE ===============
    // =====================================

    app.get('/c/:slug', function(req, res) {
      isAuth = (req.isAuthenticated()) ? true : false;



      Challenge.findOne({
        slug: req.params.slug
      })
        .exec((err, challenge) => {
          if (err) {
            res.send("Error has occured");
          } else {


            Challenge.findById(challenge._id, function (err, challenge) {
              if (err) return handleError(err);

              challenge.views = challenge.views + 1;
              challenge.save(function (err, updated) {
                if (err) return handleError(err);
                //res.send(updated);
              });
            });


            res.render('single-challenge', {
              challenge: challenge,
              isAuth: isAuth
            });
          }
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
      if (req.isAuthenticated()) {
        isAuth = (req.isAuthenticated()) ? true : false;
        res.redirect('/profile', {
          isAuth: isAuth
        });
      } else {
        // render the page and pass in any flash data if it exists
        isAuth = (req.isAuthenticated()) ? true : false;
        res.render('login.ejs', {
          message: req.flash('loginMessage'),
          isAuth: isAuth
        });
      }
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
      if (req.isAuthenticated()) {
        isAuth = (req.isAuthenticated()) ? true : false;
        res.redirect('/profile', {
          isAuth: isAuth
        });
      } else {
        // render the page and pass in any flash data if it exists
        isAuth = (req.isAuthenticated()) ? true : false;
        res.render('signup.ejs', {
          message: req.flash('signupMessage'),
          isAuth: isAuth
        });
      }
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {

      Challenge.find({
        author_id: req.user._id
      })
      .exec((err, challenges) => {
        if (err) {
          res.send("Error has occured");
        } else {

          res.render('profile', {
              user : req.user, // get the user out of session and pass to template
              isAuth: true,
              errors: errors,
              challenges: challenges,
              page: ''
          });
        }
      });
    });

    app.get('/profile/:page', (req, res) => {
      let page = req.params.page;
        Challenge.find({
          author_id: req.user._id
        })
        .exec((err, challenges) => {
          if (err) {
            res.send("Error has occured");
          } else {

            let name = '';
            let email = '';

            if (req.user.local.email) {
              name = req.user.local.name;
              email = req.user.local.email;
            } else if (req.user.google.name) {
              name = req.user.google.name;
              email = req.user.google.email;
            } else if (req.user.twitter.displayName) {
              name = req.user.twitter.displayName;
              email = req.user.twitter.email;
            } else {
              name = req.user.facebook.name;
              email = req.user.facebook.email;
            }

            res.render('profile', {
                user : req.user, // get the user out of session and pass to template
                id: req.user.id,
                name: name,
                email: email,
                isAuth: true,
                errors: errors,
                challenges: challenges,
                page: page
            });
          }
        });

    });

    app.post('/profile/edit-account', (req, res) => {
      let id = req.body.a_n;
      let name = req.body.name;
      let email = req.body.email;
      let country = req.body.country;

      User.update({
        _id: id
      }, {
        $set: {
          local: {
            name: name,
            email: email
          },
          country: country
        }
      }, () => res.redirect('/profile/account'));
    });

    // add a challenge
    app.post('/add-challenge', (req, res) => {

      req.checkBody('title', 'Title is required').notEmpty();
      req.checkBody('description', 'Description is required').notEmpty();
      req.checkBody('category', 'Category is required').notEmpty();
      var errors = req.validationErrors();
      if(errors){
        console.log(errors);
    		// res.render('profile', isLoggedIn, {
        //   isAuth: true,
    		// 	errors: errors,
        //   user : req.user
    		// });
    	} else {
        var newChallenge = new Challenge({
          title: req.body.title.trim(),
          description: req.body.description.trim(),
          slug: req.body.title.trim().replace(/\s+/g, "-"),
          author_id: req.body.author_id.trim(),
          category: req.body.category.trim()
        });
        newChallenge.save(function (err, newChallenge) {
          if (err) return console.error(err);
        });
        res.redirect('/profile');
      }
    });

    app.post('/c/d/:challenge_id', (req, res) => {
      let id = req.params.challenge_id;
      Challenge.remove({ _id: id }, function (err) {
        if (err) return handleError(err);
        res.redirect('/profile');
      });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect :  '/'
        }));

        // =====================================
        // TWITTER ROUTES ======================
        // =====================================
        // route for twitter authentication and login
        app.get('/auth/twitter', passport.authenticate('twitter'));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
          passport.authenticate('twitter', {
              successRedirect : '/profile',
              failureRedirect : '/'
          })
        );

            // =====================================
        // GOOGLE ROUTES =======================
        // =====================================
        // send to google to do the authentication
        // profile gets us their basic information including their name
        // email gets their emails
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
          passport.authenticate('google', {
                  successRedirect : '/profile',
                  failureRedirect : '/'
          })
        );


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
