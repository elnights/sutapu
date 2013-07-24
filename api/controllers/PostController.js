/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

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
      res.json(posts);
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
            res.json(post);
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
        return res.json(posts)
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
