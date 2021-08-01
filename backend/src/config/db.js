const mongoose = require("mongoose");
const chalk = require("chalk");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createConnection = async () => {
  const mongoUrl = process.env.DATABASE_URL;
  await mongoose
    .connect(mongoUrl, options)
    .then(() => {
      console.log(
        chalk.green(
          `[DATABASE] Database connected in ${process.uptime().toFixed(2)}s`
        )
      );
    })
    .catch((err) => {
      console.log(chalk.red(`[DATABASE] Database connection failed.`));
      console.error(err);
    });

  const db = mongoose.connection;

  db.on("error", function (err) {
    db.close();
    const error = new Error(`Database connection failed - ${err.response}`);
    throw error;
  });
};

module.exports = createConnection;
