/**
 * AdminController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    if (req.user) {
      User.findOne({
        id: req.user.id
      }).done(function(err, user) {
        res.view({_layoutFile: 'layout.ejs', currentUser: JSON.stringify(user)});
      });
    }

  },

  login: function (req, res) {
    res.view({_layoutFile: 'layout.ejs'});
  }

};
