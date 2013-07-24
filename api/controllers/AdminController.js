/**
 * AdminController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    res.view({_layoutFile: 'layout.ejs'});
  },

  login: function (req, res) {
    res.view({_layoutFile: 'layout.ejs'});
  }

};
