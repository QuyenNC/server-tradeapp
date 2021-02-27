var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avartarUser: {
    type: String,
    default:
      "https://res.cloudinary.com/codersx-ncq/image/upload/v1603970847/kisspng-computer-icons-user-profile-portable-network-graph-circle-svg-png-icon-free-download-5-4714-onli-5c2a3809d6e8e6.1821006915462707298803_dfp9or.jpg",
  },
  title: {
    type: String,
    required: true,
  },
  desciption: {
    type: String,
  },
  address: {
    type: String,
  },
  cata: [],
  imagePost: [],
  like: [
    {
      username: {
        type: String,
      },
    },
  ],
  comment: [
    {
      username: {
        type: String,
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
var Posts = mongoose.model("Posts", postSchema, "posts");
module.exports = Posts;
