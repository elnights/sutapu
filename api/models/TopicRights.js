/**
 * TopicRights
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	user: {
      type: 'string',
      required: true
    },

    topic: {
      type: 'string',
      required: true
    }

  }

};
