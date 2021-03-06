require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors());
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
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
