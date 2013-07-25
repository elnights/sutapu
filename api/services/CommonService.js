module.exports = {

  pickValidationMessages: function(err) {
    var result = [];
    if (err.email || err.displayName || err.name || err.user || err.topic) {
      for (var field in err) {
        for (var rule in err[field]) {
          result.push(field + ': ' + err[field][rule].message);
        }
      }
    }
    return result.join(';');
  },

  fillPostsWithUserAndTopic: function (posts, callback) {
  if (posts instanceof Array) {
    async.map(posts, function(post, result) {
      async.parallel([
        function(callback){
          User.findOneById(post.user).done(function(err, user) {
            callback(null, user);
          });
        },
        function(callback) {
          Topic.findOneById(post.topic).done(function(err, topic) {
            topic.user = {id: topic.user};
            callback(null, topic);
          });
        }
      ],
        function(err, results){
          // the results array will equal ['one','two'] even though
          // the second function had a shorter timeout.
          post.user = results[0];
          post.topic = results[1];
          result(err, post);
        }
      );
    }, function(err, posts) {
      callback(posts);
    });
  } else {
    var post = posts;
    async.parallel([
      function(callback){
        User.findOneById(post.user).done(function(err, user) {
          callback(null, user);
        });
      },
      function(callback) {
        Topic.findOneById(post.topic).done(function(err, topic) {
          callback(null, topic);
        });
      }
    ],
      function(err, results){
        // the results array will equal ['one','two'] even though
        // the second function had a shorter timeout.
        post.user = results[0];
        post.topic = results[1];
        callback(post);
      }
    );
  }
}


};
