var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: {
    type: String,
    default: ''
  },
  type: { //admin , workspaceowner , student , instructor
    type: String,
    default: "student"
  },
  email: {
    type: String,
    // unique:true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  }
});



module.exports = mongoose.model('User', User);