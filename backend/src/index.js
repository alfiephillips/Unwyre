const app = require("./app");
const chalk = require("chalk");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(chalk.yellow(`\nListening: http://localhost:${port}`));
  /* eslint-enable no-console */
});
