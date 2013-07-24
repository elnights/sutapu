/**
 * SubscriptionTopics
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
    subscription: {
      type: 'integer',
      required: true
    },

    topic: {
      type: 'integer',
      required: true
    }
  }

};
