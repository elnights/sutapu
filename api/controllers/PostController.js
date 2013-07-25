/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var async = require('async');

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  index: function(req, res) {
    var def = Post.find(),
      offset = req.param('offset'),
      limit = req.param('limit'),
      topic = req.param('topic'),
      user = req.param('user'),
      search = req.param('search'),
      subscription = req.param('subscription');

    if (subscription) {
      SubscriptionTopics.findBySubscription(subscription).done(function(err, subTopics) {
        var arr = [];
        subTopics.forEach(function(elem) {
          arr.push({topic: elem.topic});
        });

        if (arr.length) {
          def.where({
            or: arr
          })
        }

        continueRequest();

      });
    } else {
      continueRequest()
    }

    function continueRequest() {
      if (search) {
        def.where({text: {contains: search}});
      }

      if (user) {
        def.where({user: user});
      }

      if (offset) {
        def.skip(parseInt(offset));
      }

      if (limit) {
        def.limit(parseInt(limit));
      } else {
        def.limit(20);
      }

      def.sort('updatedAt DESC');

      if (topic) {
        def.where({topic: topic});
      }

      def.exec(function(err, posts) {
        CommonService.fillPostsWithUserAndTopic(posts, function(posts) {
          res.json(posts);
        });
      });
    }

  },

  find: function(req, res) {
    Post.findOne( {id: req.param('id') })
      .sort('updatedAt DESC')
      .done(function(err, post) {
        if (err) {
          return res.json({
            code: '500',
            description: err
          }, 500);
        } else {
          if (post) {
            CommonService.fillPostsWithUserAndTopic(post, function(fullPost) {
              res.json(fullPost);
            });
          } else {
            res.json({code: 500, description: 'Post not found'}, 500);
          }
        }
      });
  },

  mine: function(req, res) {
    Post.find({user: req.user.id}, function(err, posts) {
      if (err) {
        return res.json({
          code: '500',
          description: err
        }, 500);
      } else {
        CommonService.fillPostsWithUserAndTopic(posts, function(fullPost) {
          res.json(fullPost);
        });
      }
    });
  },

  create: function(req, res) {
    var topic = req.param('topic');
    Topic.findOne({id: topic}, function(err, topicObj) {
      if (!topicObj) {
        return res.json({
          code: '500',
          description: 'Topic does not exists'
        }, 500);
      } else {
        //checking rights to post ion topic
        if (topicObj.user === req.user.id) {
          createPost();
        } else {
          TopicRights.findOne({
            id: req.user.id,
            topic: topic
          }).done(function(err, granted) {
            if (granted) {
              createPost();
            } else {
              return res.json({
                code: '500',
                description: 'Permission to the topic denied'
              }, 500);
            }
          });
        }

        function createPost() {
          Post.create({
            user: req.user.id,
            text: req.param('text'),
            topic: topic
          }, function(err) {
            if (err) {
              var errMessage;
              if (errMessage = CommonService.pickValidationMessages(err)) {
                err = errMessage;
              }

              return res.json({
                code: '500',
                description: err
              }, 500);
            }
            res.json({result: 'ok'});
          });
        }
      }
    });
  }
};
