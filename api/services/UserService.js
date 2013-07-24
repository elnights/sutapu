var bcrypt = require('bcrypt');

module.exports = {
  createPasswordHash: function(s) {
    bcrypt.hash(s, 10, function(err, hash) {
      if(err) throw err;
      return hash;
    });
  }
};