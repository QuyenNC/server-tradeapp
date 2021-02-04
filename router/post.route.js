var express = require('express');
var router = express.Router();
//multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

var {protect} = require('../middlewares/authToken.middlewares');
var postsController = require('../controller/post.controller');

router.get('/', postsController.getPosts);
router.post('/create', protect, upload.array('img',12), postsController.createPosts);
router.post('/deletePost/:id', protect, postsController.deletePosts);
router.post('/:id/comment', protect, postsController.commentPosts);
// router.post('/:id/deleteCmt', postsController.deleteCommentPosts);
router.post('/:id/like', protect, postsController.likePosts);
module.exports = router;