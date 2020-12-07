const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Workspaces = require('../models/workspaces');
const workspaceRouter = express.Router();
const cors = require('./cors');
const fileUpload = require('./middleware/file-upload');
const multer_workspace_middleware = require('./middleware/multer_workspace_middleware');


const TOKEN_SECRET_KEY = "this_should_be_imported_from_env_variable" //TODO:
const jwt = require('jsonwebtoken');
var _ = require('lodash');


workspaceRouter.use(bodyParser.json());

workspaceRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Workspaces.find({})
            .then((workspaces) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(workspaces);
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .post(cors.corsWithOptions,
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
                const prod_error = new Error('Authentication failed! you are not logged in');
                prod_error.status = 403;
                // return next(dev_err);
                return next(prod_error);

            }
        }
        ,
        multer_workspace_middleware.fields(
            [
                {
                    name: 'logo_image',
                    maxCount: 1
                },
                {
                    name: 'f_image_1',
                    maxCount: 1
                },
                {
                    name: 'f_image_2',
                    maxCount: 1
                },
                {
                    name: 'f_image_3',
                    maxCount: 1
                },
                {
                    name: 'f_image_4',
                    maxCount: 1
                }
            ]
        )
        ,
        async (req, res, next) => {

            let recived_workspace = {

                //TODO:  decide if i will allow users to add workspaces without images ... 

                logo_image: !(!!req.files['logo_image']) ? "" : req.files["logo_image"][0]['filename'],  // check if the comming req has a logo_image field (i used bang bang here) --> if so add its field
                images: [ // my syntax here is abit unclear fix this with lodash later //TODO:
                    !(!!req.files['f_image_1']) ? "" : req.files['f_image_1'][0].filename,
                    !(!!req.files['f_image_2']) ? "" : req.files['f_image_2'][0].filename,
                    !(!!req.files['f_image_3']) ? "" : req.files['f_image_3'][0].filename,
                    !(!!req.files['f_image_4']) ? "" : req.files['f_image_4'][0].filename,
                ],
                workspace_name: req.body.workspaceName,
                session_price: req.body.session_price,
                rating: 5, ////TODO: will change when i figure out the rating logic
                location: {
                    lng: req.body.lng,
                    lat: req.body.lat
                },
                phone: req.body.phone,
                address: req.body.address,
                utilities: req.body.utilities.split(","),
                state: "pending",
                user_id: mongoose.Types.ObjectId(req.userData.userId) // set by the autherization middleware
            }

            // console.log("ws", recived_workspace)
            let created_workspace;
            try {
                created_workspace = await Workspaces.create(recived_workspace)
                console.log('workspace Created ', created_workspace);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(created_workspace._id);
            }
            catch (dev_err) {
                const prod_err = new Error("failed to create workspce account ")
                prod_err.status = '500';
                return next(dev_err)
                // return next(prod_err)


            }


            // res.json({ test: "test" });
        })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /workspaces');
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Workspaces.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });








workspaceRouter.route('/image/:workspaceId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(
        cors.corsWithOptions, // the corse middleware 
        fileUpload.single('image'), // the multer middleware --> if multipart body attached with field named image it's activated
        async (req, res, next) => {


            //add the image file name to the database 
            try {
                workspace = await Workspaces.findById(req.params.workspaceId);

            } catch (err) {
                const error = new HttpError(
                    'Something went wrong, could not add workspace image.',
                    500
                );
                return next(error);
            }

            // console.log(workspace)
            workspace.img = req.file.filename;
            // console.log(workspace)

            try {
                await workspace.save();
            } catch (err) {
                const error = new HttpError(
                    'Something went wrong, could not add workspace image.',
                    500
                );
                return next(error);
            }



            // console.log(req.file.filename)
            res.statusCode = 200;
            res.json("success")
        })










workspaceRouter.route('/:workspaceId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Workspaces.findById(req.params.workspaceId)
            // .populate('comments.author')
            .then((workspace) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(workspace);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /workspaces/' + req.params.workspaceId);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Workspaces.findByIdAndUpdate(req.params.workspaceId, {
            $set: req.body
        }, { new: true })
            .then((workspace) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(workspace);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Workspaces.findByIdAndRemove(req.params.workspaceId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });





workspaceRouter.route('/:workspaceId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Workspaces.findById(req.params.workspaceId)
            .populate('comments.author')
            .then((workspace) => {
                if (workspace != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(workspace.comments);
                }
                else {
                    err = new Error('Workspace ' + req.params.workspaceId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Workspaces.findById(req.params.workspaceId)
            .then((workspace) => {
                if (workspace != null) {
                    req.body.author = req.user._id;
                    workspace.comments.push(req.body);
                    workspace.save()
                        .then((workspace) => {
                            Workspaces.findById(workspace._id)
                                .populate('comments.author')
                                .then((workspace) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(workspace);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Workspace ' + req.params.workspaceId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })





module.exports = workspaceRouter;

function auth(req, res, next) {
    console.log("************************************************************");
}