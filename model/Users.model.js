var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/codersx-ncq/image/upload/v1603970847/kisspng-computer-icons-user-profile-portable-network-graph-circle-svg-png-icon-free-download-5-4714-onli-5c2a3809d6e8e6.1821006915462707298803_dfp9or.jpg",
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});
var Users = mongoose.model("Users", userSchema, "users");
module.exports = Users;
