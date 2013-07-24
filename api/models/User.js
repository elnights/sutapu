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

    bio: 'string',

    avatar: 'string',
//    givenName: 'string',
//    familyName: 'string',
    password: 'string',
    level: 'integer', // 0 - user, 1 - admin

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      if (!obj.avatar) {
        Settings.findOne({name: 'defaultAvatar'}).done(function(err, defaultAvatarSetting) {
          if (defaultAvatarSetting) {
            obj.avatar = defaultAvatarSetting.value;
          }
        });
      }
      return obj;
    }
  }
};
