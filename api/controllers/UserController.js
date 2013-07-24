/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  index: function(req, res) {
    User.find().done(function(err, user) {
      res.json(user)
    });
  },

  find: function(req, res) {
    User.findOne({id: req.param('id')}).done(function(err, user) {
      if (user) {
        res.json(user);
      } else {
        res.json({code: 500, description: 'User not found'}, 500);
      }
    });
  },

  create: function(req, res) {
    var result, error;

    var password = req.param("password");
    if (!password) {
      error = 'Empty password';
    }
    var displayName = req.param("displayName");
    if (!displayName) {
      error = 'Empty displayName';
    }
    var email = req.param("email");
    if (!email) {
      error = 'Empty email';
    } else {
      User.find({email: email}).done(function(err, user) {
        if (user.length) {
          error = "User with this email already exists";
        }
      });
    }
    if (error) {
      res.json({
        code: '500',
        description: error
      }, 500);
      return;
    }

    var passwordHash = '';

    UserService.createPasswordHash(password, function(hash) {
      passwordHash = hash;
      createUser();
    });

    function createUser() {
      User.create({
        email: email,
        displayName: displayName,
        password: passwordHash,
        avatar: req.param('avatar'),
        bio: req.param('bio')
      }).done(function(err, user) {
        // Error handling
        var errMessage;
        if (err) {
          //check for validation errors
          if (errMessage = CommonService.pickValidationMessages(err)) {
            err = errMessage;
          }

          res.json({
            code: '500',
            description: err
          }, 500);

          // The User was created successfully!
        } else {
          res.json(user, 201);
        }
      });
    }

  },

  update: function(req, res) {
    function returnPermissionDenied() {
      return res.json({
        code: '500',
        description: 'Permission denied'
      }, 403);
    }

    var paramId = req.param('id');
    if ((!req.user || paramId != req.user.id)) {
      return returnPermissionDenied();
    }
    User.findOne({
      id: paramId
    }).done(function(err, user) {
      if (!user) {
        return res.json({
          code: '500',
          description: 'User not found'
        }, 500);
      }

      //saving user model
      user.displayName = req.param('displayName');
      user.avatar = req.param('avatar');
      user.bio = req.param('bio');
      var level = req.param('level');
      if (level) {
        user.level = parseInt(level);
      }

      // save the updated value
      user.save(function(err) {
        if (err) {
          var errMessage;
          if (errMessage = CommonService.pickValidationMessages(err)) {
            err = errMessage;
          }
          return res.json({
            code: '500',
            description: err
          }, 500);
        }
        res.json({
          result: 'ok'
        });
      });


    });
  },

  updatepassword: function(req, res) {
    var paramId = req.param('id');
    if (!req.user || paramId != req.user.id) {
      return res.json({
        code: '500',
        description: 'Permission denied'
      }, 403);
    }
    User.find({
      id: paramId
    }).done(function(err, user) {
        if (!user || !user.length) {
          return res.json({
            code: '500',
            description: 'User not found'
          }, 500);
        }
        //saving user model
        user = user[0];
        UserService.checkPassword(req.param('oldPassword'), user.password, function(passwordValid) {
          if (passwordValid) {
            UserService.createPasswordHash(req.param('password'), function(passwordHash) {
              user.password = passwordHash;
              // save the updated value
              user.save(function(err) {
                res.json({
                  result: 'ok'
                });
              });
            });
          } else {
            res.json({
              code: '500',
              description: 'Permission denied: Wrong old password'
            }, 403);
          }
        });
    });
  }

};
