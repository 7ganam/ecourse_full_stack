const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Location_schema = new Schema({
    lng: {
        type: Number,
        required: true,
        // unique: true
    },
    lat: {
        type: Number,
        required: true,
        // unique: true
    },

});


const workspaceSchema = new Schema({



    logo_image: {
        type: String,
        // required: true,
        // unique: true
    },
    images: {
        type: [String],
        // required: true
    },

    workspace_name:
    {
        type: String,
        // required: true
    },

    session_price:
    {
        type: Number,
        // required: true
    },
    rating:
    {
        type: Number,
        // required: true
    },
    location:
    {
        type: Location_schema,
        // required: true
    },
    number_of_seats:
    {
        type: Number,
        // required: true
    },
    phone:
    {
        type: String,
        // required: true
    },
    address:
    {
        type: String,
        // required: true
    },
    utilities:
    {
        type: [String],
        // required: true
    },
    state:
    {
        type: String,
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


var Workspaces = mongoose.model('workspace', workspaceSchema);

module.exports = Workspaces;