/**
 * SubscriptionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var async = require('async');

function fillSubscriptionsWithTopics(subscriptions, callback) {
  if (subscriptions instanceof Array) {
    async.map(subscriptions, function(subscription, returnSubscriptionWithTopics) {
      SubscriptionTopics.findBySubscription(subscription.id).done(function(err, subscriptionTopics) {
        async.map(subscriptionTopics,
          function(subscriptionTopic, returnTopic) {
            Topic.findById(subscriptionTopic.topic).done(function(err, topic) {
              returnTopic(err, topic);
            })
          },
          function(err, topics) {
            subscription.topics = topics;
            returnSubscriptionWithTopics(err, subscription);
          }
        );
      });
    }, function(err, subscriptions) {
      callback(subscriptions);
    });
  } else {
    var subscription = subscriptions;
    SubscriptionTopics.findBySubscription(subscription.id).done(function(err, subscriptionTopics) {
      async.map(subscriptionTopics,
        function(subscriptionTopic, returnTopic) {
          Topic.findById(subscriptionTopic.topic).done(function(err, topic) {
            returnTopic(topic);
          })
        },
        function(err, topics) {
          subscription.topics = topics;
          callback(subscription);
        }
      );
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
    var def = Subscription.find({user: req.user.id}),
        search = req.param('search');

    if (search) {
      def.where({name: {contains: search}});
    }

    def.exec(function(err, topics) {
      fillSubscriptionsWithTopics(topics, function(fullSubscription) {
        res.json(fullSubscription);
      });
    });

  },

  find: function(req, res) {
    Subscription.findOne( {id: req.param('id') }, function(err, sub) {
      if (err) {
        return res.json({
          code: '500',
          description: err
        }, 500);
      } else {
        if (sub) {
          fillSubscriptionsWithTopics(sub, function(fullSubscription) {
            res.json(fullSubscription);
          });
        } else {
          res.json({code: 500, description: 'Topic not found'}, 500);
        }
      }
    });
  },

  create: function(req, res) {
    Subscription.create({
      user: req.user.id,
      name: req.param('name')
    }, function(err, subs) {
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
