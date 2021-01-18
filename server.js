require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// mongoose
const connectDB = require('./config/db');
connectDB();
//req.body
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


var authRoute = require('./router/auth.route');
var postRoute = require('./router/post.route');

app.use('/api/auth',authRoute);
app.use('/api/post',postRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})