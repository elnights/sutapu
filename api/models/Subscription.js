/**
 * Subscription
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

    name: {
      type: 'string',
      required: true
    },

    toJSON: function() {
      var obj = this.toObject();
      obj.user = {id: obj.user};
      return obj;
    }
  }

};
