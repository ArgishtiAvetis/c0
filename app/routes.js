// app/routes.js
module.exports = function(app, passport) {
    var expressValidator = require('express-validator');
    var fetch = require('node-fetch');
    var Challenge = require('./models/challenge');
    var User = require('./models/user');
    var Idea = require('./models/idea');
    let isAuth;
    var mongoose = require('mongoose');
    let errors = [];

  


// =====================================
// HOME PAGE ===========================
// =====================================


app.get('/', function(req, res) {
  
  isAuth = (req.isAuthenticated()) ? true : false;

  var usersArr = [];



  if (isAuth) {
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

    if (req.user.new_name) {
      name = req.user.new_name;
    }

  } else {

  }



  Challenge.find({
        type: 'light'
      })
        .exec((err, light) => {
          if (err) {
            res.send("Error has occured");
          } else {

            let lightsUserIds = [];

            for(let n = 0, len = light.length; n < len; n++) {
              lightsUserIds.push(light[n].author_id);
            }

            User.find({
              '_id': { $in: lightsUserIds }
            }).exec((err, lightsUsers) => {
              if (err) {
                console.log(err);
              } else {



            Challenge.find({
              type: 'teaser'
            })
              .exec((err, teaser) => {
                if (err) {
                  res.send("Error has occured");
                } else {

                  let teasersUserIds = [];

                  for(let n = 0, len = teaser.length; n < len; n++) {
                    teasersUserIds.push(teaser[n].author_id);
                  }

                  User.find({
                    '_id': { $in: teasersUserIds }
                  }).exec((err, teasersUsers) => {
                    if (err) {
                      console.log(err);
                    } else {

                  Challenge.find({
                    type: 'brainstorm'
                  })
                    .exec((err, brainstorm) => {
                      if (err) {
                        res.send(err);
                      } else {

                      var usernames = [];
                      console.log(lightsUsers);
                      console.log('-> next <-');
                      console.log(teasersUsers);

                      if (isAuth) {

                      
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

                        if (req.user.new_name) {
                          name = req.user.new_name;
                        }

                        //getUserName(req.user);

                        Challenge.find({
                          author_id: req.user._id
                        })
                        .exec((err, challenges) => {
                          if (err) {
                            res.send("Error has occured");
                          } else {
                             res.render('index', {
                              lights_users: lightsUsers,
                              teasers_users: teasersUsers,
                              usernames: usernames,
                              lights: light,
                              teasers: teaser,
                              brainstorms: brainstorm,
                              isAuth: isAuth,
                              name: name,
                              challenges: challenges
                            }); // load the index.ejs file
                          }
                        });
                      } else {
                        res.render('index', {
                          lights_users: lightsUsers,
                          teasers_users: teasersUsers,
                          usernames: usernames,
                          lights: light,
                          teasers: teaser,
                          brainstorms: brainstorm,
                          isAuth: isAuth,
                          name: 'dshjf',
                          challenges: []
                        }); // load the index.ejs file
                      }


                      }
                    }); 
                }
              });
            }
          });
        }  
      });
     }  
    });


});

app.get('/challenges', function(req, res) {
  isAuth = (req.isAuthenticated()) ? true : false;

  let name = '';
  let email = '';

if (isAuth) {
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

    if (req.user.new_name) {
      name = req.user.new_name;
    }
  } else {
    name = '';
  }

  if (req.query.category || req.query.type || req.query.sortBy) {

    var filters = {};

    if (req.query.category) {
      filters.category = req.query.category.trim();
    }

    if (req.query.type) {
      filters.type = req.query.type.trim();
    }

    Challenge.find(filters)
    .exec((err, challenges) => {
      if (err) {
        res.send("Error has occured");
      } else {

        Challenge.find({
          author_id: req.user._id
        })
        .exec((err, myChallenges) => {
          if (err) {
            res.send("Error has occured");
          } else {
            res.render('challenges', {
            challenges: challenges,
            myChallenges: myChallenges,
            isAuth: isAuth,
            name: name
          });
          }
        });
        
      }
    });
  } else {
    Challenge.find({}).sort({'published': -1})
    .exec((err, challenges) => {
      if (err) {
        res.send("Error has occured");
      } else {

        Challenge.find({
          author_id: req.user ? req.user._id : '1'
        })
        .exec((err, myChallenges) => {
          if (err) {
            res.send("Error has occured");
          } else {
            res.render('challenges', {
              challenges: challenges,
              myChallenges: challenges,
              isAuth: isAuth,
              name: name
            });
          }
        });

      }
    });
  }
});


app.get('/challenges/:category', (req, res) => {

  isAuth = (req.isAuthenticated()) ? true : false;
  
  let name = '';
  let email = '';

if (isAuth) {
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

    if (req.user.new_name) {
      name = req.user.new_name;
    }
  } else {
    name = '';
  }

  Challenge.find({
    category: req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1)
  }).exec((err, challenges) => {
    if (err) {
      res.send("An Error has occured");
    } else {
      res.render('challenges', {
        challenges: challenges,
        isAuth: isAuth,
        name: name
      });
    }
  });

});


app.get('/search', (req, res) => {

  isAuth = (req.isAuthenticated()) ? true : false;
  
  let name = '';
  let email = '';

if (isAuth) {
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

    if (req.user.new_name) {
      name = req.user.new_name;
    }
  } else {
    name = '';
  }

  Challenge.find(
      {$text: {$search: req.query.searchterm}
  })
  .exec((err, challenges) => {
    if (err) {
      res.send("An Error has occured");
    } else {
      res.render('challenges', {
        challenges: challenges,
        isAuth: isAuth,
        name: name
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
  }).exec((err, challenge) => {
  if (err) {
    res.send("error");
  } else {

    Challenge.findById(challenge._id, function (err, challenge) {
      if (err) return handleError(err);

      challenge.views = challenge.views + 1;
      challenge.save(function (err, updated) {
        if (err) return handleError(err);

      });
    });


    Idea.find({
      challenge_id: challenge._id
    }).sort({'id': -1}).exec((err, ideas) => {

      if (err) console.log(err);

      var contributors = [
        {
          local: {

          },
          google: {
            
          }
        }
      ];
      for (let n = 0, len = ideas.length; n < len; n++) {
        User.findById(ideas[n].author_id, (err, contributor) => {
          contributors.push(contributor);
        });
      }

      User.findById(challenge.author_id, (err, user) => {
      console.log(user);

      let name = '';
      let email = '';


      if (user.local.email) {
        name = user.local.name;
        email = user.local.email;
      } else if (user.google.name) {
        name = user.google.name;
        email = user.google.email;
      } else if (user.twitter.displayName) {
        name = user.twitter.displayName;
        email = user.twitter.email;
      } else {
        name = user.facebook.name;
        email = user.facebook.email;
      }

      if (user.new_name) {
        name = user.new_name;
      }

      console.log(contributors);

      if (isAuth) {
        Challenge.find({
          author_id: req.user._id
        })
        .exec((err, challenges) => {
          if (err) {
            res.send("Error has occured");
          } else {
             res.render('single-challenge', {
              ideas: ideas,
              challenge: challenge,
              contributors: contributors,
              user: req.user,
              name: name,
              user_img: user.img_url,
              isAuth: isAuth,
              challenges: challenges
            });
          }
        });
      } else {

         res.render('single-challenge', {
          ideas: ideas,
          challenge: challenge,
          contributors: contributors,
          user: req.user,
          name: name,
          user_img: user.img_url,
          isAuth: isAuth,
          challenges: []
        });

      }

    });

    });

    }
});

    });


    // POST add a challenge is in SERVER.js



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
          isAuth: isAuth,
          challenges: []
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
          isAuth: isAuth,
          challenges: []
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

      if (req.user.new_name) {
        name = req.user.new_name;
      }

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
              name: name,
              page: ''
          });
        }
      });
    });

    app.get('/profile/:page', isLoggedIn, (req, res) => {
        let page = req.params.page;



        



        Challenge.find({
          author_id: req.user._id
        })
        .exec((err, challenges) => {
          if (err) {
            res.send("Error has occured");
          } else {


              Idea.find({
                author_id: req.user._id
              }).exec((err, myIdeas) => {
                if (err) {
                  console.log(err);
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

            if (req.user.new_name) {
              name = req.user.new_name;
            }

            res.render('profile', {
                user : req.user, // get the user out of session and pass to template
                id: req.user.id,
                name: name,
                email: email,
                isAuth: true,
                errors: errors,
                challenges: challenges,
                ideas: myIdeas,
                page: page
            });


                }
              });

           
          }
        });

    });

  
app.get('/start-challenge', isLoggedIn, (req, res) => {

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

  if (req.user.new_name) {
    name = req.user.new_name;
  }


  Challenge.find({
    author_id: req.user._id
  })
  .exec((err, challenges) => {
    if (err) {
      res.send("Error has occured");
    } else {

      res.render('add-challenge', {
          user : req.user, // get the user out of session and pass to template
          id: req.user.id,
          isAuth: true,
          errors: errors,
          challenges: challenges,
          name: name
      });


      }
    });

     
    });



    app.post('/c/d/:challenge_id', (req, res) => {
      let id = req.params.challenge_id;
      Challenge.remove({ _id: id }, function (err) {
        if (err) return console.log(err);
        res.redirect('/profile');
      });
    });

    app.post('/edit-campaign', (req, res) => {

      var id = req.body.id,
          title = req.body.title,
          overview = req.body.overview,
          description = req.body.description,
          // type = req.body.type,
          reward = req.body.reward; // careful
          // rewards_number = req.body.rewards_number;

      Challenge.update({
        _id: id
      }, {
        $set: {
          title: title,
          overview: overview,
          description: description,
          // type: type,
          reward: reward,
          // rewards_number: rewards_number
        }
      }, () => res.redirect('/profile/challenges'));

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
    res.redirect('/login');
}

function getUserName(user) {

      let name, email;

      if (user.local.email) {
        name = user.new_name;
        email = user.local.email;
      } else if (user.google.name) {
        name = user.google.name;
        email = user.google.email;
      } else if (user.twitter.displayName) {
        name = user.twitter.displayName;
        email = user.twitter.email;
      // } else if (user.new_name) {
      //   name = user.new_name;
      //   email = user.local.email;
      } else {
        name = user.facebook.name;
        email = user.facebook.email;
      }

}