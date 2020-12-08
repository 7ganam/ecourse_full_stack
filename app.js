//steps i did to start this backend in order 
// 1-started the porject using express generator --> express ecoursesServer --- > then npm install --> test connection from postman 
// 2-added a config file to the root directory and added the two config lines in app.js 
//    hint : sould have added the config file to .gitignore here 
// 3-added nodemon to the start command in package.json file 
// 4-install mongoose --- added the connect to mongose lines in app.js --- started the mongoose deamon "mongod"
// 5-added the courses router ---> create a modle folder and courses model --> created a courses routers --> imported the router and added the middle ware in app.js
//---> installed cors and added the corse file to the router folder 
// git commit  d50174554f04bd64765a3af498bf0f6b83e40bf3

require('dotenv').config()
//adding my config files 

var config = require('./config');

const url = config.mongoUrl;
//add my routers 
var courseRouter = require('./routes/courseRouter');
var workspaceRouter = require('./routes/workspaceRouter');



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');

var bodyParser = require('body-parser')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// console.log(process.env.TEST_EV)



//connect to mongose db 
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_URI);
// console.log(process.env.MONGO_URI)
connect.then((db) => {
  console.log("Connected correctly to server ....");
}, (err) => { console.log(err); });




app.use('/users', usersRouter);
app.use('/courses', courseRouter);
app.use('/workspaces', workspaceRouter);



// if not any of our apis are hit ... this means that the user don't have the client code ... send it to him
//note that react router automatically loads the right if the requested URL wasn't the root /  .. i think the browser 
//saves the url and when the react app is fetched it examins the url that caused the fetch and loads the right route directly..which is very cool.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/front_end/build')));
  app.get('*', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("fullUrl")
    console.log({ fullUrl })
    res.sendFile('./front_end/build/index.html', { root: __dirname });
    // res.sendFile(path.resolve(__dirname, 'front_end', 'build', 'index.html'))
  }

  )

}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  console.log(err.message)
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message })

  // res.render('error');
  // console.log("--------------------------", error.message || 'An unknown error occurred!')
  // res.json({ message: error.message || 'An unknown error occurred!' });
});



module.exports = app;

