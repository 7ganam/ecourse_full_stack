const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');
const userRouter = express.Router();
const cors = require('./cors');
const fileUpload = require('./middleware/file-upload');
const multer_user_middleware = require('./middleware/multer_user_middleware');
var _ = require('lodash');

const bcrypt = require('bcryptjs'); // to hash passwords


userRouter.use(bodyParser.json());
const TOKEN_SECRET_KEY = "this_should_be_imported_from_env_variable" //TODO:
const jwt = require('jsonwebtoken');



userRouter.route('/signup')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions,
    multer_user_middleware.single("image"),// extract image file --> save image file to filesystme --> add req.file object --> create req.body object
    async (req, res, next) => {
      // console.log("Request ---", req);
      // console.log(user)


      //gerate a hashed password for the input password with salt 12
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log(hashedPassword)

      } catch (dev_err) {
        const prod_error = new Error('Could not create user, please try again.');
        prod_error.status = "500"
        // return next(dev_err)
        return next(prod_error)
      }


      // parse the recived formdata into json object
      let user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: _.has(req, 'file') ? req.file.filename : "",
      }
      // console.log('user ', user);


      // add the json object to the database
      let created_user;
      try {
        // throw (new Error("test"))
        created_user = await Users.create(user)
      }
      catch (dev_err) {
        const prod_error = new Error('signing up failed, please try later.');
        prod_error.status = "500"
        return next(dev_err)
        // return next(prod_error)
      };


      //generating tokens
      let token;
      try {
        token = jwt.sign(
          { userId: created_user.id, email: created_user.email, image: created_user.image },
          TOKEN_SECRET_KEY,
          { expiresIn: '1h' }
        );
      } catch (dev_err) {
        const prod_error = new Error('signing up failed, please try later.');
        prod_error.status = "500"
        return next(dev_err)
        // return next(prod_error)
      }


      //sending the response back
      res
        .status(201)
        .json({ userId: created_user.id, email: created_user.email, token: token });

    });




userRouter.route('/login') //TODO:  add false log in 
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions,
    async (req, res, next) => {
      const { email, password } = req.body;

      // seach database for the same email
      let existingUser;
      try {
        existingUser = await Users.findOne({ email: email });
      } catch (dev_err) {
        const prod_error = new Error('Loggin in failed, please try again later.')
        prod_error.status = "500"
        return next(prod_error);
      }


      //check if the password could be used to generate the same hashed password in the database
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
      } catch (dev_err) {
        const prod_error = new Error('Could not log you in, please check your credentials and try again.')
        prod_error.status = "500"
        return next(prod_error);
      }
      if (!isValidPassword) {
        const prod_error = new Error('Invalid credentials, could not log you in.')
        prod_error.status = "403"
        return next(prod_error);
      }
      ////t in case of not using hashes
      //      // if (!existingUser || existingUser.password !== password) {
      //      //   const prod_error = new Error('Invalid credentials, could not log you in.');
      //      //   prod_error.status = "403"
      //      //   return next(prod_error);
      //      // }


      //generating tokens

      let token;
      let expiration_time_in_hours = 10000;//TODO: make the token expiration in the front end  ... i will leave this huge number as is now
      let expiration_date = new Date(new Date().getTime() + expiration_time_in_hours * 60 * 60 * 1000);
      let expirateion_date_string = expiration_date.toISOString();
      try {
        token = jwt.sign(
          { userId: existingUser.id, email: existingUser.email, image: existingUser.image },

          TOKEN_SECRET_KEY,
          { expiresIn: expiration_time_in_hours + 'h' }
        );
      } catch (dev_err) {
        const prod_error = new Error('signing up failed, please try later.');
        prod_error.status = "500"
        return next(dev_err)
        // return next(prod_error)
      }


      //sending the response back
      res
        .status(201)
        .json({
          message: 'Logged in!',
          expirateion_date_string: expirateion_date_string,
          user:
          {

            email: existingUser.email,
            id: existingUser.id,
            image: existingUser.image
          },
          token: token
        });



    });



module.exports = userRouter;

function auth(req, res, next) {
  console.log("************************************************************");
}