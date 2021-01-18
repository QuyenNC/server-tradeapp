var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    username: {
        type : String,
        required : true
    },
    avartarUser:{
        type : String,
        required : true
    },
    title:{
        type:String,
        required: true
    },
    desciption: {
      type: String
    },
    imagePost:{
        type : String,
        required : true
    },
    like: [
        {
            username: {
                type : String
            },
        },
    ],
    comment: [
        {
            username: {
                type : String
            },
            text : {
                type : String
            },
            date: {
              type: Date,
              default: Date.now,
            },
        }
    ],
    date: {
      type: Date,
      default: Date.now,
    }
});
var Posts = mongoose.model('Posts', postSchema,"posts");
module.exports = Posts;
