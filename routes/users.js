
var express = require('express');
var router = express.Router();
var User = require('../model/user');
var passport = require('passport');
var Localstrategy = require('passport-local').Strategy;

const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/user/:userid', function (req, res) {
  User.findById(req.params.userid).populate({
    path: 'bookid', model: 'books'
  }).exec(function (err, DataUser) {
    res.render("userpage", { result1: DataUser, result2: DataUser.bookid });
  })
})

function loginyoung(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}

// router.get('/new', loginyoung,function(req, res, next) {
//     res.render('addnewbook');
// });

// router.get('/book', function(req, res, next) {
//   res.render('landing');
// });

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res, next) {
  res.redirect('/book/');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/book/');
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
});

passport.use(new Localstrategy(function (username, password, done) {
  User.getUserByName(username, function (err, user) {
    if (err) throw error
    if (!user) {
      //ไม่เจอusernameนี้
      return done(null, false)
    }
    else {
      User.comparePassowrd(password, user.password, function (err, isMatch) {
        if (err) throw error
        console.log(isMatch);
        if (isMatch) {
          return done(null, user)
        }
        else {
          return done(null, false)
        }
      });
    }
  });
}));

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', [
  check('username', 'sai username duay').not().isEmpty(),
  check('email', 'sai email duay').isEmail(),
  check('password', 'sai password duay').not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    res.render('register', { errors: errors });
  }
  else {
    var n_usn = req.body.username;
    var n_email = req.body.email;
    var n_password = req.body.password;
    var newUser = new User({
      username: n_usn,
      email: n_email,
      password: n_password
    });
    User.findOne({ username: n_usn, email: n_email }, function (err, check) {
      if (err) {
        console.log("case 1");
        throw err;
      }
      if (!check) {
        User.createUser(newUser, function (err, user) {
          if (err) {
            console.log('Where ?????????')
          }
        });
        res.location('/');
        res.redirect('/');
      }
      else {
        res.render("register");
      }
    })
  }
});

module.exports = router;
