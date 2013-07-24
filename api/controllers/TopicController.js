/**
 * TopicController
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
      res.json(topics);
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
          res.json(topic);
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
          return res.json(topics)
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
      res.json({result: 'ok'});
    });
  }

};
