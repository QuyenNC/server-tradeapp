var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradesSchema = new Schema({
    userId:{
        type : mongoose.ObjectId,
        required: true
    },
    userName: {
        type : String,
        required : true
    },
    tradeWithUserId:{
        type : mongoose.ObjectId,
        required: true
    },
    tradeWithUsername: {
        type : String,
        required : true
    },
    postId:{
        type : mongoose.ObjectId,
        required: true
    },
    titlePost: {
        type : String,
        required : true
    },
    tradeWithPostId:{
        type : mongoose.ObjectId,
        required: true
    },
    tradeWithTitlePost: {
        type : String,
        required : true
    },
    address: {
        type : String,
        required : true
    },
    tradeWithAdress: {
        type : String,
        required : true
    },
    status: {
        type : String,
        default: 'chờ xác nhận',
    },
    date: {
      type: Date,
      default: Date.now,
    }
});
var Trades = mongoose.model('Trades', tradesSchema,"trades");
module.exports = Trades;
