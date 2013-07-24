var passport = require('passport');

var AuthController = {
  currentUser: function(req, res) {
    res.send(req.user);
  },

  local: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user))
      {
        res.json({code: 401, description: "loginIncorrect"}, 401);
        return;
      }

      req.logIn(user, function(err)
      {
        if (err)
        {
          res.send('login func failed');
          return;
        }

        res.json(user);
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
    res.json({
      result: 'ok'
    });
	}

};
module.exports = AuthController;