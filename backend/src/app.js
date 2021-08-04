const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const clear = require("clear-console");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

require("dotenv").config();

const checkEnv = require("./utils/checkEnv");
const createConnection = require("./config/db");

const middlewares = require("./handler");
const isLoggedIn = require("./middleware/auth");
const api = require("./api");

clear();
checkEnv();

const app = express();

app.use(morgan("dev"));

app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    name: "github-auth-session",
    keys: ["key1", "key2"],
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

createConnection();

app.get("/", (_, res) => {
  res.json({
    message: "Unwyre 🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.get("/test", isLoggedIn, (req, res) => {
  res.status(200).json({
    message: `Hello ${req.user.displayName}`,
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
