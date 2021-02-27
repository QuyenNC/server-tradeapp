const jwt = require("jsonwebtoken");
require("dotenv").config();

var Users = require("../model/Users.model.js");

// Protect routes
exports.protect = async (req, res, next) => {
  // Get token from header
  const token = req.header("auth-token");
  // Check if not token
  if (!token) {
    return res.json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Make sure the user has been verified
    req.user = await Users.findById(decoded.userId).select("-password");

    next();
  } catch (err) {
    res.json({ msg: "Token is not valid" });
  }
};
