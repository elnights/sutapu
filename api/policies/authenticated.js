/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.isAuthenticated()) {
    return ok();
  }

  // User is not allowed
  else {
    if (req.wantsJSON) {
      res.json( {"result": "Not logged in"} , 403);
    } else {
      res.redirect('/login.html');
    }
  }
};