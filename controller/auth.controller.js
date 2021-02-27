//using dotenv
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

      const user = await Users.findOne({ email: email });

      if (!user) {
        return res.json({ errors: { msg: "Username không tồn tại" } });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match === true) {
          var older_token = await jwt.sign(
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
  }
};
