const mongoose = require("mongoose");
const generateSlug = require("../utils/generateSlug");

const days = 7;
let date = new Date();
const expiryDate = date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

const UrlSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: generateSlug(6),
    },
    expirationDate: {
      type: Date,
      default: expiryDate,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", UrlSchema);
