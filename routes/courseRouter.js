const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Courses = require('../models/courses');

const courseRouter = express.Router();
const cors = require('./cors');

const fileUpload = require('./middleware/file-upload');

const multer_course_middleware = require('./middleware/multer_course_middleware');

const TOKEN_SECRET_KEY = "this_should_be_imported_from_env_variable" //TODO:
const jwt = require('jsonwebtoken');
var _ = require('lodash');


courseRouter.use(bodyParser.json());

courseRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.find({})
            .populate('comments.author')
            .then((courses) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(courses);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(
        cors.corsWithOptions
        ,
        (req, res, next) => { // autherization middleware 
            try {
                const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
                if (!token) {
                    throw new Error('Authentication failed! you are not logged in');
                }
                const decodedToken = jwt.verify(token, TOKEN_SECRET_KEY);
                req.userData = { userId: decodedToken.userId, user: decodedToken.user };
                next();
            } catch (dev_err) {
                const prod_error = new Error('Authentication failed! you are not logged in!');
                prod_error.status = 403;
                return next(prod_error);
                // return next(prod_error);

            }
        }
        ,
        async (req, res, next) => { //setting course to database middleware 
            let recieved_course;
            try {
                Sessions2 = req.body.Sessions.map(session => {// set isopen to false for all sessions
                    mod_session = session
                    mod_session.isOpen = false
                    return (mod_session)

                })
                console.log(Sessions2)
                recieved_course =
                {
                    Sessions: Sessions2,
                    author: req.userData.user.name,
                    description: req.body.description,
                    endDate: req.body.endDate,
                    img: req.body.img,
                    price: req.body.price,
                    rating: req.body.rating,
                    slogan: req.body.slogan,
                    startDate: req.body.startDate,
                    title: req.body.title,
                    what_will_learn: req.body.what_will_learn,
                    workspace_name: req.body.workspace_name,
                    user_id: mongoose.Types.ObjectId(req.userData.userId) // set by the autherization middleware

                }
                // console.log(recieved_course)
            }
            catch (dev_error) {
                let prod_error = new Error("failed to register course")
                prod_error.status = "500";
                // return next(prod_error)
                return next(dev_error)
            }

            try {
                let created_course = await Courses.create(recieved_course);
                // console.log('Course Created ', created_course);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(created_course._id);

            }
            catch (dev_error) {
                let prod_error = new Error("failed to register course")
                prod_error.status = "500";
                return next(dev_error)
                // return next(prod_error)
            }

            // res.json({ test: "test" });
        })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /courses');
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Courses.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });






courseRouter.route('/image/:courseId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(
        cors.corsWithOptions, // the corse middleware 

        multer_course_middleware.any(),// the multer middleware --> if multipart body attached with field named image it's activated

        async (dev_err_multer, req, res, next) => { // middle ware to delete course data if image has invalid format
            //search the db for the course
            try {
                course = await Courses.findById(req.params.courseId);
            } catch (dev_err) {
                const prod_error = new Error('Something went wrong, could not add course image.')
                prod_error.status = "500"
                return next(prod_error);
            }

            course.remove(() => {
                const prod_error = new Error('invalid image format.')
                prod_error.status = "500"
                return next(prod_error);
            })

        },



        async (req, res, next) => {


            //-------- adding images (if found) to the course in database 

            //search the db for the course
            try {
                course = await Courses.findById(req.params.courseId);
            } catch (dev_err) {
                const prod_error = new Error('Something went wrong, could not add course image.')
                prod_error.status = "500"
                return next(prod_error);
            }



            // if req has image file add it as course image if not do nothing
            try {
                course.img = (_.has(req, 'files') && _.has(req.files[0], 'fieldname') && (req.files[0].fieldname === 'image')) ? req.files[0].filename : "";
            }
            catch (dev_error) {
                const prod_error = new Error(' could not add course image.')
                prod_error.status = "500"
                return next(prod_error);
            }


            for (var i = 0; i < course.Sessions.length; i++) {
                console.log("1")
                if (_.has(req, 'files')) {
                    console.log("2")

                    let session_image = req.files.filter(file => file['fieldname'] == `session_${i + 1}_img`)
                    console.log({ session_image })
                    if (session_image.length > 0) {
                        console.log(session_image[0].filename)

                        course.Sessions[i].Session_image = session_image[0].filename
                    }
                }

            }

            console.log({ course })


            try {
                await course.save();
            } catch (err) {
                const error = new HttpError(
                    'Something went wrong, could not add course image.',
                    500
                );
                return next(error);
            }


            console.log(course.Sessions)

            // console.log(req.file.filename)
            res.statusCode = 200;
            res.json("success")
        })










courseRouter.route('/:courseId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.findById(req.params.courseId)
            // .populate('comments.author')
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /courses/' + req.params.courseId);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Courses.findByIdAndUpdate(req.params.courseId, {
            $set: req.body
        }, { new: true })
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Courses.findByIdAndRemove(req.params.courseId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

courseRouter.route('/:courseId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .populate('comments.author')
            .then((course) => {
                if (course != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(course.comments);
                }
                else {
                    err = new Error('Course ' + req.params.courseId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course != null) {
                    req.body.author = req.user._id;
                    course.comments.push(req.body);
                    course.save()
                        .then((course) => {
                            Courses.findById(course._id)
                                .populate('comments.author')
                                .then((course) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(course);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Course ' + req.params.courseId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })





module.exports = courseRouter;

function auth(req, res, next) {
    console.log("************************************************************");
}