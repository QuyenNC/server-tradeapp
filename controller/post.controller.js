require("dotenv").config();
const fs = require("fs");
var jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});
//using mongoose
var Posts = require("../model/Post.model.js");
var Users = require("../model/Users.model.js");
const { Console } = require("console");
//using bcrypt
module.exports = {
  getPosts: async function (req, res) {
    try {
      const posts = await Posts.find().sort({ date: -1 });
      return res.json({
        success: {
          msg: "Get posts success",
          posts,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({ errors: { msg: "Server error" } });
    }
  },
  createPosts: async function (req, res) {
    try {
      const { cataPro, title, address, noteProduct } = req.body;
      let imagePost = [];
      for (let i = 0; i < req.files.length; i++) {
        var coverImg = await cloudinary.uploader.upload(req.files[i].path);
        await fs.unlinkSync(req.files[i].path);
        imagePost.push(coverImg.url);
      }
      await Posts.create({
        userId: req.user._id,
        username: req.user.username,
        avartarUser: req.user.avatar,
        title,
        desciption: noteProduct,
        address,
        cata: cataPro,
        imagePost,
      });
      const posts = await Posts.find().sort({ date: -1 });
      res.json({ success: { msg: "Đăng bài thành công", posts } });
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
  deletePosts: async function (req, res) {
    try {
      if (req.body.userId.toString() === req.user._id.toString()) {
        await Posts.findOneAndDelete({ _id: req.params.id });
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "Gỡ bài thành công", posts } });
      } else {
        res.json({ errors: { msg: "Token không hợp lệ" } });
      }
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
  commentPosts: async function (req, res) {
    try {
      const post = await Posts.findById(req.params.id);
      req.body.username = req.user.username;
      post.comment.unshift(req.body);
      await Posts.findByIdAndUpdate(
        { _id: req.params.id },
        { comment: post.comment }
      );
      res.json({ success: { msg: "Comment success" } });
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
  // ,
  // deleteCommentPosts :async function(req, res){
  //     try {
  //         const post = await Posts.findById(req.params.id);
  //         const cmtExit = post.comment.find((cmt) =>(
  //             cmt._id.toString() === req.body._id
  //         ));
  //         const indexCmtExit = post.comment.indexOf(cmtExit);
  //         post.comment.splice(indexCmtExit, 1);
  //         await Posts.findByIdAndUpdate({_id : req.params.id },{comment : post.comment });
  //         res.json({ success: { msg: 'remove comment susscess' } });
  //     } catch{
  //         res.json({ errors: { msg: 'Server error' } });
  //     }
  // }
  likePosts: async function (req, res) {
    try {
      const { username } = req.user;
      const post = await Posts.findById(req.params.id);
      const userExit = post.like.find((like) => like.username === username);
      if (!userExit) {
        post.like.push({ username });
        await Posts.findByIdAndUpdate(
          { _id: req.params.id },
          { like: post.like }
        );
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "like success", posts } });
      } else {
        const indexUserExit = post.like.indexOf(userExit);
        post.like.splice(indexUserExit, 1);
        await Posts.findByIdAndUpdate(
          { _id: req.params.id },
          { like: post.like }
        );
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "unlike success", posts } });
      }
    } catch (error) {
      console.log(error);
      res.json({ errors: { msg: "Server error" } });
    }
  },
};
