/**
 * Posts
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

    user: {
      type: 'integer',
      required: true
    },

    topic: {
      type: 'integer',
      required: true
    },

    text: {
      type: 'string',
      required: true
    }
  }

};
