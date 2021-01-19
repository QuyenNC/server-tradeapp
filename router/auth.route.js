var express = require('express');
var router = express.Router();
//multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
var authController = require('../controller/auth.controller');

router.post('/login', authController.login);
router.post('/register', authController.register);
// router.post('/forgot', authController.forgot);
// router.get('/profile/:username',authController.profile);
// router.post('/profile/edit/:username',upload.single('img'),authController.editProfile);
// router.post('/profile/password/:username',authController.changePassword);
module.exports = router;