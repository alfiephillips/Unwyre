const express = require("express");
const emojis = require("./emojis");
const url = require("./url");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);

router.use("/url", url);

module.exports = router;
