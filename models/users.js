var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: { //admin , workspaceowner , student , instructor
    type: String,
    default: "student"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  }
});



module.exports = mongoose.model('User', User);