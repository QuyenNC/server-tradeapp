var express = require('express');
var router = express.Router();
//multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

var postsController = require('../controller/post.controller');

router.get('/', postsController.getPosts);
router.post('/create',upload.single('img'), postsController.createPosts);
router.post('/:id/deletePost',upload.single('img'), postsController.deletePosts);
router.post('/:id/comment', postsController.commentPosts);
router.post('/:id/deleteCmt', postsController.deleteCommentPosts);
router.post('/:id/like', postsController.likePosts);
module.exports = router;