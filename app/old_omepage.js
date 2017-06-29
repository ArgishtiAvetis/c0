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

            let usernames = [];

            

            var getUsernames = () => {
              return new Promise((resolve, reject) => {

              function getUsernames() {
                for(let i = 0, len  = challenges.length; i < len; i++) {
                  User.findById(challenges[i].author_id, function (err, user) {
                    if (err) return handleError(err);
                    console.log((user.new_name) ? user.new_name : user.google.name);
                    console.log('-----');

                    usernames.push((user.new_name) ? user.new_name : user.google.name);

                  });
                };
              };

              return usernames.length ? resolve(usernames) : reject('Not Loaded');

              });
            }

            getUsernames()
              .then((data) => {
                console.log(data);
              })
              .catch((err) => {
                console.log(err);
              });


            res.render('index', {
              usernames: usernames,
              challenges: challenges,
              isAuth: isAuth
            }); // load the index.ejs file
            

           
            

            // function renderView() {
            //   console.log('---->>>>> ' + usernames);
            //   res.render('index', {
            //     usernames: usernames,
            //     challenges: challenges,
            //     isAuth: isAuth
            //   }); // load the index.ejs file
            // }

            // let p = new Promise((resolve, reject) => {
            //   getUsernames();
            // }).then(response => {
            //   renderView();
            // })
            //   .catch(reject => res.send("Error")); 
              
            
        
          } // are challenges retrieved?
        });

    });
