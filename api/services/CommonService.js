module.exports = {

  pickValidationMessages: function(err) {
    var result = [];
    if (err.email || err.displayName || err.name) {
      for (var field in err) {
        for (var rule in err[field]) {
          result.push(field + ': ' + err[field][rule].message);
        }
      }
    }
    return result.join(';');
  }

};
