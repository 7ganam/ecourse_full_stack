//steps i did to start this backend in order 
// 1-started the porject using express generator --> express ecoursesServer --- > then npm install --> test connection from postman
// 2-added a config file to the root directory and added the two config lines in app.js 
// 3-added nodemon to the start command in package.json file 
// 4-install mongoose --- added the connect to mongose lines in app.js --- started the mongoose deamon "mongod"
// 5-added the courses router ---> create a modle folder and courses model --> created a courses routers --> imported the router and added the middle ware in app.js
//---> installed cors and added the corse file to the router folder 



//adding my config files 
var config = require('./config');
const url = config.mongoUrl;

//add my routers 
var courseRouter = require('./routes/courseRouter');



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//connect to mongose db 
const mongoose = require('mongoose');
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server ttt");
}, (err) => { console.log(err); });






app.use('/', indexRouter);
app.use('/users', usersRouter);


//my own routers 
app.use('/courses', courseRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
