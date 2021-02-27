var express = require("express");
var router = express.Router();
//multer
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

var { protect } = require("../middlewares/authToken.middlewares");
var tradesController = require("../controller/trades.controller");

router.get("/", tradesController.getTrades);
router.post("/create", protect, tradesController.createTrade);
router.put("/status/:id", protect, tradesController.putStatusTrade);
router.put(
  "/status-exchange/:id",
  protect,
  tradesController.putStatusEchangeTrade
);
module.exports = router;
