const express = require("express");
const url = require("./url");
const auth = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/url", url);
router.use("/auth", auth);

module.exports = router;
