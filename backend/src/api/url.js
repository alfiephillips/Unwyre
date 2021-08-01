const express = require("express");
const moment = require("moment");

const router = express.Router();

const Url = require("../models/Url");

router.post("/", async (req, res) => {
  const userId = req.userId;
  const {origin, slug} = req.body;

  const existingSlug = Url.exists({slug: slug})

  if(existingSlug) {
      return res.status(400).json({
          path: req.originalUrl,
          message: "Internal Server Error",
          stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      })
  }

  try {
    newUrl = await Url.create({
      userId: userId,
      origin: origin,
      slug: slug,
    });
  } catch (err) {
    return res.status(500).json({
      path: req.originalUrl,
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  }

  return res.status(200).json({
    url: {
        originalUrl: newUrl.origin,
        slug: newUrl.slug,
        expiration: newUrl.expirationDate
    },
  });
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  let url;

  try {
    url = await Url.findOne({ slug: slug });
  } catch (err) {
    return res.status(500).json({
      path: req.originalUrl,
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  }

  const currTime = Date.now();

  if(currTime > url.expirationDate) {
      try {
          await Url.deleteOne({slug: slug})

          return res.status(400).json({
              message: "This url has expired!"
          })
      } catch (err) {
          return res.status(500).json({
              path: req.originalUrl,
              message: "Internal Server Error",
              stack: stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
          })
      }
  }

  if (url) {
    return res.redirect(url.origin);
  } else {
    return res.status(404).json({
      path: req.originalUrl,
      message: "🔍 - Url Not Found",
    });
  }
});

module.exports = router;
