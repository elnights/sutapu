/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  schema: true,

  attributes: {

  	displayName: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      email: true,
      required: true
    },
//    givenName: 'string',
//    familyName: 'string',
    password: 'string',
    level: 'integer', // 0 - user, 1 - admin

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};
