//using dotenv
require("dotenv").config();
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var randomToken = require("random-token").create(
  "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
);
var jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});
//using mongoose
var Users = require("../model/Users.model.js");

//using bcrypt
var bcrypt = require("bcrypt");
var saltRounds = 10;
module.exports = {
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email: email }).exec();

      if (!user) {
        return res.json({ errors: { msg: "Username không tồn tại" } });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match === true) {
          var older_token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY
          );
          return res.json({
            success: {
              msg: "Đăng nhập thành công",
              token: older_token,
              user: await Users.findOne({ email: email }).select(
                "-password -email"
              ),
            },
          });
        } else {
          return res.json({ errors: { msg: "Mật khẩu không đúng" } });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
  register: async function (req, res) {
    try {
      const { email, username, phonenumber, address } = req.body;
      const userName = await Users.findOne({ username: username }).exec();
      if (userName) {
        return res.json({ errors: { msg: "Username đã tồn tại" } });
      }
      const emailUser = await Users.findOne({ email: email }).exec();
      if (emailUser) {
        return res.json({ errors: { msg: "Email đã tồn tại" } });
      } else {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
          req.body.password = hash;
          await Users.create({
            email,
            username,
            password: req.body.password,
            phonenumber,
            address,
          });
        });
        return res.json({ success: { msg: "Đăng kí thành công" } });
      }
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
  // ,
  // forgot:async function(req, res){
  //     const user = await Users.findOne({ email: req.body.email }).exec();

  //     if(!user){
  //         return res.json({ errors: { msg: 'Email không tồn tại' } });
  //     }else{
  //         const newPassword = randomToken(16);
  //         bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
  //             await Users.findOneAndUpdate({email: req.body.email}, { password : hash})
  //         });
  //         var transporter = nodemailer.createTransport(smtpTransport({
  //             service: 'gmail',
  //             host: 'smtp.gmail.com',
  //             auth: {
  //                 user: process.env.SESSION_USER,
  //                 pass: process.env.SESSION_PASS
  //             }
  //         }));
  //         var mailOptions = {
  //             from:  process.env.SESSION_USER,
  //             to: user.email,
  //             subject: 'Instagram Forgot Password !!',
  //             text: `Mật khẩu mới của  bạn là : ${newPassword} `
  //         };
  //         transporter.sendMail(mailOptions, function(error, info){
  //             if (error) {
  //                 console.log(error);
  //             } else {
  //                 console.log('Email sent: ' + info.response);
  //             }
  //         });
  //         return res.json({ success: { msg: 'Mật khẩu mới đã được gửi đến tài khoản email của bạn' } });
  //     }
  // },
  // profile:async function(req, res){
  //     const user = await Users.findOne({ username: req.params.username }).exec();
  //     if(!user){
  //         return res.json({ errors: { msg: 'Username không tồn tại' } });
  //     }
  //     return res.json({ success: { msg: 'Lấy thông tin thành công', user : user } });
  // },
  // editProfile:async function(req, res){
  //     try {
  //         const username = req.params.username;
  //         if(req.file !== undefined){
  //             var coverImg = await cloudinary.uploader.upload(req.file.path);
  //             await fs.unlinkSync(req.file.path)
  //             await Users.findOneAndUpdate({username}, { fullname : req.body.fullname,avatar : coverImg.url })
  //             return res.json({ success: { msg: 'Thay đổi thông tin thành công', newFullname : req.body.fullname , avatar : coverImg.url } });
  //         }else{
  //             await Users.findOneAndUpdate({username}, { fullname: req.body.fullname,avatar : req.body.img })
  //             return res.json({ success: { msg: 'Thay đổi thông tin thành công', newFullname : req.body.fullname, avatar : req.body.img } });
  //         }
  //     } catch{
  //         res.json({ errors: { msg: 'Server error' } });
  //     }
  // },
  // changePassword :async function(req, res){
  //     try {
  //         const username = req.params.username;
  //         const user = await Users.findOne({username}).exec();
  //         const match = await bcrypt.compare(req.body.oldPass, user.password);
  //         if(match === true){
  //             bcrypt.hash(req.body.newPass, saltRounds, async function(err, hash) {
  //                 req.body.newPass = hash
  //                 await Users.findOneAndUpdate({username}, { password : req.body.newPass});
  //             });
  //             return res.json({ success: { msg: 'Thay đổi mật khẩu thành công'}});
  //         }else{
  //             return res.json({ errors: { msg: 'Mật khẩu không đúng'}});
  //         }
  //     } catch{
  //         res.json({ errors: { msg: 'Server error' } });
  //     }
  // }
};
