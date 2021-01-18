require('dotenv').config();
const fs = require("fs");
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key:process.env.CLOUDINARY_APIKEY, 
    api_secret: process.env.CLOUDINARY_APISECRET 
  });
//using mongoose
var Posts = require("../model/Post.model.js");
var Users = require("../model/Users.model.js");
//using bcrypt
module.exports = {
    getPosts :async function(req, res){
        try {
            const posts = await Posts.find();
            res.json({ susscess: { 
                msg: 'Get posts susscess',
                posts 
            } });
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    createPosts :async function(req, res){
        try {
            const user = await Users.findOne({username : req.body.username}).exec();
            req.body.avartarUser = user.avatar;
            var coverImg = await cloudinary.uploader.upload(req.file.path);
            await fs.unlinkSync(req.file.path)
            req.body.imagePost = coverImg.url;
            await Posts.create(req.body);
            res.json({ susscess: { msg: 'Create post susscess' } });
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    deletePosts :async function(req, res){
        try {
            await Posts.findOneAndDelete({_id : req.params.id});
            res.json({ susscess: { msg: 'Delete post susscess' } });
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    commentPosts :async function(req, res){
        try {
            const post = await Posts.findById(req.params.id);
            post.comment.push(req.body);
            await Posts.findByIdAndUpdate({_id : req.params.id },{comment : post.comment })
            res.json({ susscess: { msg: 'Comment susscess' } });
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    deleteCommentPosts :async function(req, res){
        try {
            const post = await Posts.findById(req.params.id);
            const cmtExit = post.comment.find((cmt) =>(
                cmt._id.toString() === req.body._id
            ));
            const indexCmtExit = post.comment.indexOf(cmtExit);
            post.comment.splice(indexCmtExit, 1);
            await Posts.findByIdAndUpdate({_id : req.params.id },{comment : post.comment });
            res.json({ susscess: { msg: 'remove comment susscess' } });
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    },
    likePosts :async function(req, res){
        try {
            const post = await Posts.findById(req.params.id);
            const userExit = post.like.find((like) =>(
                like.username === req.body.username
            ));
            if(!userExit){
                post.like.push(req.body);
                await Posts.findByIdAndUpdate({_id : req.params.id },{like : post.like })
                res.json({ susscess: { msg: 'like susscess' } });
            }else{
                const indexUserExit = post.like.indexOf(userExit);
                post.like.splice(indexUserExit, 1);
                await Posts.findByIdAndUpdate({_id : req.params.id },{like : post.like });
                res.json({ susscess: { msg: 'unlike susscess' } });
            }
        } catch{
            res.json({ errors: { msg: 'Server error' } });
        }
    }
}
    