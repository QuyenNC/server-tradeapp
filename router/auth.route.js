var express = require("express");
var router = express.Router();
//multer
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var authController = require("../controller/auth.controller");

router.post("/login", authController.login);
router.post("/register", authController.register);
module.exports = router;
