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
                address : tradeWithAdress,//người gửi
                tradeWithAdress :address //người nhận
            });
            const trades = await Trades.find().sort({date:-1});
            res.json({ success: { msg: 'Gửi yêu cầu thành công ',trades } });
        } catch(error){
            console.log(error);
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    putStatusTrade :async function(req, res){
        try {
            
            const trade = await Trades.findById(req.params.id);
            if(req.user._id.toString() !== trade.userId.toString()){
                res.json({ errors: { msg: 'Người dùng không hợp lệ' } });
            }else{
                await Trades.findByIdAndUpdate({_id :req.params.id},{status : req.body.status})
                const trades = await Trades.find().sort({date:-1});
                res.json({ success: { msg: 'Hủy yêu cầu thành công ',trades } });
            }
        } catch(error){
            console.log(error);
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    putStatusEchangeTrade :async function(req, res){
        try {
            
            const trade = await Trades.findById(req.params.id);
            if(req.user._id.toString() !== trade.tradeWithUserId.toString()){
                res.json({ errors: { msg: 'Người dùng không hợp lệ' } });
            }else{
                await Trades.findByIdAndUpdate({_id :req.params.id},{statusWithTrade:req.body.status})
                const trades = await Trades.find().sort({date:-1});
                res.json({ success: { msg: 'Hủy yêu cầu thành công ',trades } });
            }
        } catch(error){
            console.log(error);
            res.json({ errors: { msg: 'Server error' } });
        }
    }
}
    