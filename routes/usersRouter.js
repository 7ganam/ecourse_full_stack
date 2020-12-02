const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');
const userRouter = express.Router();
const cors = require('./cors');
const fileUpload = require('./middleware/file-upload');
const multer_user_middleware = require('./middleware/multer_user_middleware');
var _ = require('lodash');

userRouter.use(bodyParser.json());

userRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions,
    multer_user_middleware.single("image"),
    (req, res, next) => {
      // console.log("Request ---", req);
      let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image: _.has(req, 'file') ? req.file.filename : "",
      }
      console.log(user)
      Users.create(user)
        .then((user) => {
          // console.log('user Created ', user);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json("success");
        }, (err) => next(err))
        .catch((err) => next(err));
    });




userRouter.route('/login')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions,
    async (req, res, next) => {
      const { email, password } = req.body;
      console.log(req.body)
      let existingUser;

      try {
        existingUser = await Users.findOne({ email: email });
      } catch (err) {
        const error = new Error(
          'Loggin in failed, please try again later.')
        return next(error);
      }

      if (!existingUser || existingUser.password !== password) {
        const error = new Error(
          'Invalid credentials, could not log you in.'
        );
        return next(error);
      }

      res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true })
      });
    });



module.exports = userRouter;

function auth(req, res, next) {
  console.log("************************************************************");
}