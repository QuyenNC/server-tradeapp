const fs = require("fs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});
//using mongoose
const Posts = require("../model/Post.model.js");
const Users = require("../model/Users.model.js");
//using bcrypt
module.exports = {
  getPosts: async function (req, res, next) {
    try {
      const posts = await Posts.find().sort({ date: -1 });
      return res.json({
        success: {
          msg: "Get posts success",
          posts,
        },
      });
    } catch (err) {
      next(error);
    }
  },
  createPosts: async function (req, res, next) {
    try {
      const { cataPro, title, address, noteProduct } = req.body;
      let imagePost = [];
      for (let i = 0; i < req.files.length; i++) {
        const coverImg = await cloudinary.uploader.upload(req.files[i].path);
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
      next(error);
    }
  },
  deletePosts: async function (req, res, next) {
    try {
      if (req.body.userId.toString() === req.user._id.toString()) {
        await Posts.findOneAndDelete({ _id: req.params.id });
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "Gỡ bài thành công", posts } });
      } else {
        res.json({ errors: { msg: "Token không hợp lệ" } });
      }
    } catch (error) {
      next(error);
    }
  },
  commentPosts: async function (req, res, next) {
    try {
      const post = await Posts.findById(req.params.id);
      req.body.username = req.user.username;
      await Posts.findByIdAndUpdate(
        { _id: req.params.id },
        { $addToSet: { comment: req.body } }
      );
      res.json({ success: { msg: "Comment success" } });
    } catch (error) {
      next(error);
    }
  },
  likePosts: async function (req, res, next) {
    try {
      const { username } = req.user;
      const post = await Posts.findById(req.params.id);
      const userExit = post.like.find((like) => like.username === username);
      if (!userExit) {
        await Posts.findByIdAndUpdate(
          { _id: req.params.id },
          { $addToSet: { like: username } }
        );
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "like success", posts } });
      } else {
        await Posts.findByIdAndUpdate(
          { _id: req.params.id },
          { $pullAll: { like: userExit } }
        );
        const posts = await Posts.find().sort({ date: -1 });
        res.json({ success: { msg: "unlike success", posts } });
      }
    } catch (error) {
      next(error);
    }
  },
};
