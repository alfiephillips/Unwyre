const dotenv = require("dotenv").config();
const chalk = require("chalk");

const environment = {
  NODE_ENVIRONMENT: "NODE_ENV",
  DATABASE_URL: "DATABASE_URL",
  PORT: "PORT",
  SESSION_SECRET: "SESSION_SECRET",
  CORS_ORIGIN: "CORS_ORIGIN",
};

module.exports = () => {
  const localEnvironment = process.env;

  for (const [_, value] of Object.entries(environment)) {
    if (value in localEnvironment) {
      console.log(chalk.green(`${value} ✅`));
    } else {
      console.log(chalk.red(`${value} ❌`));
    }
  }
};
