/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var async = require('async');

function fillPostsWithUserAndTopic(posts, callback) {
  if (posts instanceof Array) {
    async.map(posts, function(post, result) {
      async.parallel([
        function(callback){
          User.findOneById(post.user).done(function(err, user) {
            callback(null, user);
          });
        },
        function(callback) {
          Topic.findOneById(post.topic).done(function(err, topic) {
            callback(null, topic);
          });
        }
      ],
        function(err, results){
          // the results array will equal ['one','two'] even though
          // the second function had a shorter timeout.
          post.user = results[0];
          post.topic = results[1];
          result(err, post);
        }
      );
    }, function(err, posts) {
      callback(posts);
    });
  } else {
    var post = posts;
    async.parallel([
      function(callback){
        User.findOneById(post.user).done(function(err, user) {
          callback(null, user);
        });
      },
      function(callback) {
        Topic.findOneById(post.topic).done(function(err, topic) {
          callback(null, topic);
        });
      }
    ],
      function(err, results){
        // the results array will equal ['one','two'] even though
        // the second function had a shorter timeout.
        post.user = results[0];
        post.topic = results[1];
        callback(post);
      }
    );
  }
}

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
      def.where({text: {contains: search}});
    }

    if (user) {
      def.where({user: user});
    }

    if (topic) {
      def.where({topic: topic});
    }

    def.exec(function(err, posts) {
      fillPostsWithUserAndTopic(posts, function(posts) {
        res.json(posts);
      });
    });
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
            fillPostsWithUserAndTopic(post, function(fullPost) {
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
        fillPostsWithUserAndTopic(posts, function(fullPost) {
          res.json(fullPost);
        });
      }
    });
  },

  create: function(req, res) {
    Post.create({
      user: req.user.id,
      text: req.param('text'),
      topic: req.param('topic')
    }, function(err, posts) {
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

};
