
var express = require('express');
var router = express.Router();
var User = require('../model/user');
var books = require('../model/books');
var passport = require('passport');
var Localstrategy = require('passport-local').Strategy;
const multer = require('multer');
const path = require('path');

const { check, validationResult } = require('express-validator');

const { locals } = require('../app');

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const imagefilter = function (req, res, cb) {
  var ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.gif' && ext !== '.jpg' && ext !== '.jpeg') {
    return cb(new Error("Type File not include"), false)
  }
  cb(null, true);
}

const upload = multer({ storage: storage, filefilter: imagefilter });

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

router.get("/user/:userid/editimg", function (req, res) {
  User.findById(req.params.userid, function (err, founduser) {
    if (err) { console.log("test 2"); }
    else { res.render("userpicedit", { user: founduser }) }
  })
})

router.put("/user/:userid", upload.single('userpic'), function (req, res) {
  let n_img = req.file.filename;
  var n_card = { userimg: n_img };
  User.findByIdAndUpdate(req.params.userid, n_card, function (err, updateimguser) {
    if (err) { console.log("test 2"); }
    else { res.redirect('/user/' + req.params.userid); }
  })
})

router.get("/user/:userid/editinfo", function (req, res) {
  User.findById(req.params.userid, function (err, founduser) {
    if (err) { console.log("test 2"); }
    else { res.render("editinfo", { user: founduser }) }
  })
})

router.put("/user/:userid/infoedit", upload.single('userpic'), function (req, res) {
  let n_name = req.body.name_user;
  let n_email = req.body.email_user;
  var n_card = { username: n_name, email: n_email };
  User.findByIdAndUpdate(req.params.userid, n_card, function (err, updateinfouser) {
    if (err) { console.log("test 2"); }
    else { res.redirect('/user/' + req.params.userid); }
  })
})

function loginyoung(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  else { res.redirect('/login'); }
}

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
    if (!user) { return done(null, false) }
    else {
      User.comparePassowrd(password, user.password, function (err, isMatch) {
        if (err) throw error
        console.log(isMatch);
        if (isMatch) { return done(null, user) }
        else { return done(null, false) }
      });
    }
  });
}));

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', [
  check('username', 'fill username').not().isEmpty(),
  check('email', 'fill email').isEmail(),
  check('password', 'fill password').not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) { res.render('register', { errors: errors }); }
  else {
    var n_usn = req.body.username;
    var n_email = req.body.email;
    var n_perm = "";
    var n_usimg = "userpic-1593004146126.png";
    var n_password = req.body.password;
    var newUser = new User({
      username: n_usn,
      email: n_email,
      userimg: n_usimg,
      permission: n_perm,
      password: n_password
    });
    User.findOne({ username: n_usn, email: n_email }, function (err, check) {
      if (err) {
        console.log("case 1");
        throw err;
      }
      if (!check) {
        User.createUser(newUser, function (err, user) {
          if (err) { console.log('Where ?') }
        });
        res.location('/');
        res.redirect('/login');
      }
      else { res.render("register"); }
    })
  }
});

module.exports = router;
