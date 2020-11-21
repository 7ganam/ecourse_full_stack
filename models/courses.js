const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});


var Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;