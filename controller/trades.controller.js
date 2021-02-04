require('dotenv').config();
const fs = require("fs");
var jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key:process.env.CLOUDINARY_APIKEY, 
    api_secret: process.env.CLOUDINARY_APISECRET 
  });
//using mongoose
var Posts = require("../model/Post.model.js");
var Users = require("../model/Users.model.js");
var Trades = require("../model/Trades.model.js");
const { Console } = require('console');
//using bcrypt
module.exports = {
    getTrades :async function(req, res){
        try {
            const trades = await Trades.find().sort({date:-1});
            return res.json({ success: { 
                msg: 'Get trades success',
                trades 
            } });
        } catch(err){
            console.log(err);
            return res.json({ errors: { msg: 'Server error' } });
        }
    }
    ,
    createTrade :async function(req, res){
        try {
            const {_id,userId, username, address, title,tradeWithPostId,tradeWithAdress} = req.body;
            const tradeWithPost = await Posts.findById(tradeWithPostId).exec();;
            await Trades.create({
                userId : req.user._id,//người gửi
                userName : req.user.username,//người gửi
                tradeWithUserId:userId,//người nhận
                tradeWithUsername:username,//người nhận
                postId: _id,//người nhận
                titlePost : title,//người nhận
                tradeWithPostId,//người gửi
                tradeWithTitlePost : tradeWithPost.title,//người gửi
                address : address,//người gửi
                tradeWithAdress//người nhận
            });
            const trades = await Trades.find().sort({date:-1});
            res.json({ success: { msg: 'Gửi yêu cầu thành công ',trades } });
        } catch(error){
            console.log(error);
            res.json({ errors: { msg: 'Server error' } });
        }
    }
}
    