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
      res.send(user)
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
    }
    if (error) {
      res.json({
        code: '500',
        description: error
      }, 500);
      return;
    }
    User.create({
      email: email,
      displayName: displayName,
      password: UserService.createPasswordHash(password)
    }).done(function(err, user) {
      // Error handling
      var errMessage = [];
      if (err) {
        //check for validation errors
        if (err.email) {
          for (var rule in err.email) {
            errMessage.push(err.email[rule].message);
          }
        }
        errMessage = errMessage.join(';');

        res.json({
          code: '500',
          description: errMessage
        }, 500);
      // The User was created successfully!
      } else {
        res.json({userId: user.id}, 201);
      }
    }) ;
  }

};
