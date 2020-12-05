const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Session_schema = new Schema({
    Session_title: {
        type: String,
        // required: true,
        // unique: true
    },
    Session_Description: {
        type: String,
        // required: true,
        // unique: true
    },

    Session_startDate: {
        type: Date,
        // required: true,
        // unique: true
    },

    isOpen: {
        type: Boolean,
        // required: true,
        // unique: true
    }
    // this should be removed late TODO:

});




const courseSchema = new Schema({


    title: {
        type: String,
        required: true,
        // unique: true
    },

    img:
    {
        type: String,
        // required: true
    },
    author:
    {
        type: String,
        // required: true
    },
    startDate:
    {
        type: Date,
        // required: true
    },
    endDate:
    {
        type: Date,
        // required: true
    },
    workspace_name:
    {
        type: String,
        // required: true
    },
    workspace_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        // required: true
    },
    price:
    {
        type: Number,
        // required: true
    },
    description:
    {
        type: String,
        // required: true
    },
    slogan: {
        type: String,
        // required: true
    },
    Sessions: {
        type: [Session_schema],
        // required: true
    }
    ,
    what_will_learn: {
        type: [String],
        // required: true
    }
    , rating: {
        type: Number,
        // required: true
    },
    user_id: {
        type: mongoose.ObjectId,
        required: true,
        // unique: true
    },

},

    {
        timestamps: true
    });


var Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;