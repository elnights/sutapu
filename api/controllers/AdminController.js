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
        .sort('createdAt DESC')
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

function fillUserWithTopicAndPostAndSubscription(item, callback) {
  async.parallel([
    function(callback){
      Topic.findByUser(item.id).sort('createdAt DESC').done(function(err, topics) {
        callback(null, topics);
      });
    },
    function(callback) {
      Post.findByUser(item.id).sort('createdAt DESC').done(function(err, posts) {
        CommonService.fillPostsWithUserAndTopic(posts, function(fullItems) {
          callback(null, fullItems);
        });
      });
    },
    function(callback) {
      Subscription.findByUser(item.id).sort('createdAt DESC').done(function(err, subscriptions) {
        fillSubscriptionsWithUserAndTopics(subscriptions, function(fullSubscriptions) {
          callback(null, fullSubscriptions);
        });
      });
    }
  ],
    function(err, res){
      item.topics = res[0];
      item.posts = res[1];
      item.subscriptions = res[2];
      callback(item);
    }
  );
};

function fillTopicsWithUsers(topics, callback) {
  if (topics instanceof Array) {
    async.map(topics, function(topic, result) {
      async.parallel([
        function(callback){
          User.findOneById(topic.user).done(function(err, user) {
            callback(null, user);
          });
        }
      ],
        function(err, res){
          topic.user = res[0];
          result(err, topic);
        }
      );
    }, function(err, topics) {
      callback(topics);
    });
  } else {
    var topic = topics;
    async.parallel([
      function(callback){
        User.findOneById(topic.user).done(function(err, topic) {
          callback(null, topic);
        });
      }
    ],
      function(err, res){
        topic.user = res[0];
        callback(topic);
      }
    );
  }
};

function fillSubscriptionsWithUserAndTopics(subscriptions, callback) {
  if (subscriptions instanceof Array) {
    async.map(subscriptions, function(subscription, result) {
      async.parallel([
        function(callback){
          User.findOneById(subscription.user).done(function(err, user) {
            callback(null, user);
          });
        },
        function(callback) {
          SubscriptionTopics.findBySubscription(subscription.id).done(function(err, subTopics) {
            async.map(subTopics, function(subTopic, returnTopic) {
              Topic.findOneById(subTopic.topic).done(function(err, topic) {
                returnTopic(null, topic);
              });
            }, function(err, topics) {
              callback(null, topics)
            });
          });
        }
      ],
        function(err, results){
          subscription.user = results[0];
          subscription.topics = results[1];
          result(err, subscription);
        }
      );
    }, function(err, subscriptions) {
      callback(subscriptions);
    });
  } else {
    var subscription = subscriptions;
    async.parallel([
      function(callback){
        User.findOneById(subscription.user).done(function(err, user) {
          callback(null, user);
        });
      },
      function(callback) {
        SubscriptionTopics.findBySubscription(subscription.id).done(function(err, subTopics) {
          async.map(subTopics, function(subTopic, returnTopic) {
            Topic.findOneById(subTopic.topic).done(function(err, topic) {
              returnTopic(null, topic);
            });
          }, function(err, topics) {
            callback(null, topics)
          });
        });
      }
    ],
      function(err, results){
        subscription.user = results[0];
        subscription.topics = results[1];
        callback(subscription);
      }
    );
  }
}

module.exports = {

  login: function (req, res) {
    res.view({_layoutFile: 'layout.ejs'});
  },

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

  // Lists

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

  subscriptions: function (req, res) {
    lists(res, req, Subscription, function(user, items, pagin){
      fillSubscriptionsWithUserAndTopics(items, function(fullItems) {
        res.view({
          _layoutFile: 'layout.ejs',
          currentUser: user,
          items: fullItems,
          pagin: pagin,
          menu: 'Subscriptions'
        });
      });
    });
  },

  topics: function (req, res) {
    lists(res, req, Topic, function(user, items, pagin){
      fillTopicsWithUsers(items, function(fullItems) {
        res.view({
          _layoutFile: 'layout.ejs',
          currentUser: user,
          items: fullItems,
          pagin: pagin,
          menu: 'Topics'
        });
      })
    });
  },

  posts: function (req, res) {
    lists(res, req, Post, function(user, items, pagin){
      CommonService.fillPostsWithUserAndTopic(items, function(fullItems) {
        Topic.findByUser(req.user.id).sort('createdAt DESC').done(function(err, topics) {
          res.view({
            _layoutFile: 'layout.ejs',
            currentUser: user,
            items: fullItems,
            topics: topics,
            pagin: pagin,
            menu: 'Posts'
          });
        });
      });
    });
  },

  // Item
  user: function (req, res) {
    if (req.user) {
      if (req.param('id')) {
        User.findOne(req.user.id).done(function(err, user) {
          User.findOne(req.param('id')).done(function(err, item) {
            fillUserWithTopicAndPostAndSubscription(item, function(item) {
              res.view({
                _layoutFile: 'layout.ejs', 
                currentUser: user,
                item: item,
                menu: 'Users'
              });
            });
          });
        });
      } else {
        res.redirect('/admin/');
      }
    } else {
      res.redirect('/admin/login');
    }
  },

  subscription: function (req, res) {
    if (req.user) {
      if (req.param('id')) {
        User.findOne(req.user.id).done(function(err, user) {
          Subscription.findOne(req.param('id')).done(function(err, item) {
            fillSubscriptionsWithUserAndTopics(item, function(item) {
              res.view({
                _layoutFile: 'layout.ejs', 
                currentUser: user,
                item: item,
                menu: 'Subscriptions'
              });
            });
          });
        });
      } else {
        res.redirect('/admin/');
      }
    } else {
      res.redirect('/admin/login');
    }
  },

  topic: function (req, res) {
    console.log(req.param('id'))
  }

};
