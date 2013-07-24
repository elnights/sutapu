/**
 * Allow any authenticated user.
 */
var deniedJSON = {
  result: 'Permission denied'
};
module.exports = function (req, res, ok) {

  function sendDenied() {
    if (req.wantsJSON) {
      res.json(deniedJSON, 403);
    } else {
      res.redirect('/admin/login');
    }
  }
  // User is allowed, proceed to controller
  if (req.isAuthenticated()) {
    if (req.user.level) {
      return ok();
    } else {
      sendDenied();
    }
  } else {
    sendDenied();
  }
};