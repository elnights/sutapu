/**
 * TopicController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var async = require('async');

function fillTopicsWithUserAndTopic(topics, callback) {
  if (topics instanceof Array) {
    async.map(topics, function(topic, result) {
      User.findOneById(topic.user).done(function(err, results) {
        topic.user = results;
        result(err, topic);
      });
    }, function(err, topics) {
      callback(topics);
    });
  } else {
    var topic = topics;
    User.findOneById(topic.user).done(function(err, results) {
      topic.user = results;
      callback(topic);
    });
  }
}

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  index: function(req, res) {
    var def = Topic.find(),
        offset = req.param('offset'),
        limit = req.param('limit'),
        user = req.param('user'),
        search = req.param('search');

    def.sort('updatedAt DESC');

    if (offset) {
      def.skip(parseInt(offset));
    }

    if (limit) {
      def.limit(parseInt(limit));
    } else {
      def.limit(20);
    }

    if (search) {
      def.where({name: {contains: search}});
    }

    if (user) {
      def.where({user: user});
    }

    def.exec(function(err, topics) {
      fillTopicsWithUserAndTopic(topics, function(fullTopic) {
        res.json(fullTopic);
      });
    });

  },

  find: function(req, res) {
    Topic.findOne( {id: req.param('id') }, function(err, topic) {
      if (err) {
        return res.json({
          code: '500',
          description: err
        }, 500);
      } else {
        if (topic) {
          fillTopicsWithUserAndTopic(topic, function(fullTopic) {
            res.json(fullTopic);
          });
        } else {
          res.json({code: 500, description: 'Topic not found'}, 500);
        }
      }
    });
  },

  mine: function(req, res) {
    Topic.find({user: req.user.id})
      .sort('updatedAt DESC')
      .done(function(err, topics) {
        if (err) {
          return res.json({
            code: '500',
            description: err
          }, 500);
        } else {
          fillTopicsWithUserAndTopic(topics, function(fullTopic) {
            res.json(fullTopic);
          });
        }
      });
  },

  create: function(req, res) {
    Topic.create({
      user: req.user.id,
      name: req.param('name')
    }, function(err, topics) {
      var errMessage;
      if (err) {
        if (errMessage = CommonService.pickValidationMessages(err)) {
          err = errMessage;
        }

        return res.json({
          code: '500',
          description: err
        }, 500);
      }
      fillTopicsWithUserAndTopic(topics, function(fullTopic) {
        res.json(fullTopic);
      });
    });
  },

  adduserpermission: function(req, res) {
    var user = req.param('user');
    if (user === req.user.id) {
      return res.json({
        code: '500',
        description: "Can't give permission to user himself"
      }, 500);
    }
    if (!user) {
      return res.json({
        code: '500',
        description: 'No user given'
      }, 500);
    }
    Topic.findOne({
      user: req.user.id,
      id: req.param('id')
    }, function(err, topic) {
      if (topic) {
        TopicRights.findOne({subscription: topic.id, topic: user}).done(function(err, subscriptionTopic) {
          if (subscriptionTopic) {
            return res.json({
              code: '500',
              description: 'Permission already given'
            }, 500);
          } else {
            User.findOneById(user).done(function(err, userObject) {
              if (!userObject) {
                return res.json({
                  code: '500',
                  description: 'User does not exists'
                }, 500);
              } else {
                TopicRights.create({
                  topic: topic.id,
                  user: user
                }).done(function(err, userRight) {
                  res.json({
                    result: 'ok'
                  });
                });
              }
            });
          }
        });
      } else {
        return res.json({
          code: '500',
          description: 'Topic not found'
        }, 500);
      }
    });
  }

};
