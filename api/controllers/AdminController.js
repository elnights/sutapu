/**
 * AdminController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.

 */

async = require('async');

function lists(res, req, model, callback){
  if (req.user) {
    var perPage = 5, pagin,
        page = req.param('page') ? parseInt(req.param('page')) : 1;

    model.count().done(function(err, count){
      pagin = {
        max: 10,
        current: page,
        count: count,
        limit: perPage,
        offset: (page-1) * perPage,
        total: Math.ceil(count/perPage)
      };

      model.find()
        .limit(pagin.limit)
        .skip(pagin.offset)
        .sort('id DESC')
        .done(function(err, items) {
          User.findOne(req.user.id).done(function(err, user) {
            callback(user, items, pagin)
          });
        }); 
    });
  } else {
    res.redirect('/admin/login');
  }
};

module.exports = {

  index: function (req, res) {
    if (req.user) {
      User.findOne(req.user.id).done(function(err, user) {
        async.map([User, Topic, Post], function(item, callback) {
          item.count().done(function(err, item) {
            callback(null, item)
          });
        }, function(err, results) {
          res.view({
            _layoutFile: 'layout.ejs', 
            currentUser: user,
            anal: {
              user: results[0],
              topic: results[1],
              post: results[2]
            },
            menu: 'index'
          });
        });
      });
    } else {
      res.redirect('/admin/login');
    }
  },

  users: function (req, res) {
    lists(res, req, User, function(user, items, pagin){
      res.view({
        _layoutFile: 'layout.ejs',
        currentUser: user,
        items: items,
        pagin: pagin,
        menu: 'Users'
      });
    });
  },

  topics: function (req, res) {
    lists(res, req, Topic, function(user, items, pagin){
      res.view({
        _layoutFile: 'layout.ejs',
        currentUser: user,
        items: items,
        pagin: pagin,
        menu: 'Topics'
      });
    });
  },

  posts: function (req, res) {
    lists(res, req, Post, function(user, items, pagin){
      CommonService.fillPostsWithUserAndTopic(items, function(fullItems) {
        res.view({
          _layoutFile: 'layout.ejs',
          currentUser: user,
          items: fullItems,
          pagin: pagin,
          menu: 'Posts'
        });
      });
    });
  },

  login: function (req, res) {
    res.view({_layoutFile: 'layout.ejs'});
  }

};
