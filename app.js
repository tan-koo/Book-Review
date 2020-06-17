var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var db = mongoose.connection;

var passport = require('passport');
var Localstrategy = require('passport-local').Strategy;
var session = require('express-session');

var bookRouter = require('./routes/book');
var usersRouter = require('./routes/users');
var commentsRouters = require('./routes/comment');

var app = express();
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:true,
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
    res.locals.user = req.user || null;
    res.locals.currentUser = req.user;
    next();
});

app.use('/book', bookRouter);
app.use('/', usersRouter);
app.use('/book/:id/comments', commentsRouters);

module.exports = app;
