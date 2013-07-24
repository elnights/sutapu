var passport = require('passport');

var AuthController = {
  currentUser: function(req, res) {
    res.send(req.user);
  },

  local: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user))
      {
        res.json({code: 500, description: "loginIncorrect"}, 500);
        return;
      }

      req.logIn(user, function(err)
      {
        if (err)
        {
          res.send('login func failed');
          return;
        }

        res.redirect('/');
      });
    })(req, res);
  },

//	google: function(req, res) {
//		console.log('in auth google');
//		passport.authenticate('google', function(err, user, info) {
//			if ((err) || (!user))
//			{
//				res.redirect('/auth');
//				return;
//			}
//
//			req.logIn(user, function(err)
//			{
//				if (err)
//				{
//					res.send('login func failed');
//					return;
//				}
//
//				res.redirect('/');
//			});
//		})(req, res);
//	},

	logout: function(req, res) {
		req.logout();
  	res.redirect('/');
	}

};
module.exports = AuthController;