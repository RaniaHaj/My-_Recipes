const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/wonders", function (req, res) {
  res.send(wonders);
});
