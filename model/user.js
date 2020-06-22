
//Model
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/LoginDB';
var bcrypt = require('bcryptjs');

var passport = require('passport');
var Localstrate = require('passport-local').Strategy;
mongoose.connect(mongoDB, {
    useNewUrlParser: true
})

//Connect 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodn Connect Error'));

// Create Schema
var userSchema = mongoose.Schema({
    username: String,
    permission: String,
    email: String,
    password: String
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
module.exports.getUserByName = function (username, callback) {
    var query = {
        email: username
    }
    User.findOne(query, callback);
}

module.exports.comparePassowrd = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        callback(null, isMatch);
    });
}