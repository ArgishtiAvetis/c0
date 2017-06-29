isAuth = (req.isAuthenticated()) ? true : false;
      Challenge.find({
        type: 'light'
      })
        .exec((err, light) => {
          if (err) {
            res.send("Error has occured");
          } else {

            Challenge.find({
              type: 'teaser'
            })
              .exec((err, teaser) => {
                if (err) {
                  res.send("Error has occured");
                } else {

                  Challenge.find({
                    type: 'brainstorm'
                  })
                    .exec((err, brainstorm) => {
                      if (err) {
                        res.send(err);
                      } else {
                        

                          //async function getUsernames() {
                          
                          //let usernames = [];

                          // for (var i = 0; i < 50; i ++) {
                          //   usernames.push(i + 1);
                          // }

                           
                        

                        async function getUserIds() {
                          let userIds = [];

                          for(let i = 0, len  = light.length; i < len; i++) {
                            userIds.push(new mongoose.Types.ObjectId(light[0].author_id));
                          }
                          return userIds;
                        }

                        async function fetchUsernames(userIds) {
                          let usernames = [];
                          User.find({
                              '_id': { $in: userIds }
                            })
                              .exec((err, user) => {
                                if (err) {
                                  console.log("Error has occured: " + err);
                                } else {
                                  usernames.push('Person');
                                  //console.log((user.new_name) ? user.new_name : 'default');
                                  console.log('-> loop ' + user);
                                  return usernames;//
                                }
                              });
                            
                          };
                        //}
                          

                        
                        async function renderView(usernames) {
                          console.log('------->>>');
                          console.log(usernames);
                          console.log('------->>>');
                          res.render('index', {
                            usernames: usernames,
                            lights: light,
                            teasers: teaser,
                            brainstorms: brainstorm,
                            isAuth: isAuth
                          }); // load the index.ejs file

                        }

                        async function getUsernamesAndRenderView() {
                          //let usernames = await getUsernames();
                          var userIds = await getUserIds();
                          console.log(userIds);

                          var usernames = await fetchUsernames(userIds);
                          console.log(usernames);
                          res.render('index', {
                            usernames: usernames,
                            lights: light,
                            teasers: teaser,
                            brainstorms: brainstorm,
                            isAuth: isAuth
                          }); // load the index.ejs file

                        }

                        getUsernamesAndRenderView();
                        
                      }
                    })


                }