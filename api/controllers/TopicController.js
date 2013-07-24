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
    res.send('dummy');
    //Topic.find()
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
    Topic.find({user: req.user.id}, function(err, topics) {
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
