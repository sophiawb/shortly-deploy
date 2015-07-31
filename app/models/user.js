var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');



var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
      });
    }
});

userSchema.pre('init', function(next) {
  this.hashPassword().then(next);
})


var User = mongoose.model('User', userSchema);



// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   }
// });

module.exports = User;
