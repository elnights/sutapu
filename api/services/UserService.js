var bcrypt = require('bcrypt');

module.exports = {
  createPasswordHash: function(s, callback) {
    bcrypt.hash(s, 10, function(err, hash) {
      if(err) throw err;
      callback(hash);
    });
  },

  checkPassword: function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, res) {
      callback(res);
    });
  }
};