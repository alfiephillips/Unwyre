const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const clear = require("clear-console");

require("dotenv").config();

const checkEnv = require("./utils/checkEnv");
const createConnection = require("./config/db");

const middlewares = require("./handler");
const api = require("./api");

clear();
checkEnv();

const app = express();

app.use(morgan("dev"));

app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

createConnection();

app.get("/", (_, res) => {
  res.json({
    message: "Unwyre 🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
