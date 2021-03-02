require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// // mongoose
const connectDB = require("./config/db");
connectDB();
//req.body
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoute = require("./router/auth.route");
const postRoute = require("./router/post.route");
const tradeRoute = require("./router/trades.route");

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/trade", tradeRoute);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
