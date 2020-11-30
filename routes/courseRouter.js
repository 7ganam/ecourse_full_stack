const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Courses = require('../models/courses');

const courseRouter = express.Router();
const cors = require('./cors');

const fileUpload = require('./middleware/file-upload');


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
    .post(cors.corsWithOptions, (req, res, next) => {
        // console.log("Request ---", req);
        // console.log(req.body)
        Courses.create(req.body)
            .then((course) => {
                console.log('Course Created ', course);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course._id);
            }, (err) => next(err))
            .catch((err) => next(err));
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
        fileUpload.single('image'), // the multer middleware --> if multipart body attached with field named image it's activated
        async (req, res, next) => {


            //add the image file name to the database 
            try {
                course = await Courses.findById(req.params.courseId);

            } catch (err) {
                const error = new HttpError(
                    'Something went wrong, could not add course image.',
                    500
                );
                return next(error);
            }

            // console.log(course)
            course.img = req.file.filename;
            // console.log(course)

            try {
                await course.save();
            } catch (err) {
                const error = new HttpError(
                    'Something went wrong, could not add course image.',
                    500
                );
                return next(error);
            }



            // console.log(req.file.filename)
            res.statusCode = 200;
            res.json("success")
        })










courseRouter.route('/:courseId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .populate('comments.author')
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