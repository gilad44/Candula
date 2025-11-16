const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const dbConnectionString = config.get("DB_NAME");
const password = config.get("DB_PASSWORD");

if (!dbConnectionString || !password) {
  console.error(chalk.red("❌ MongoDB Atlas credentials not configured!"));
  console.error(
    chalk.yellow("Set DB_NAME and DB_PASSWORD in environment variables")
  );
  process.exit(1);
}

mongoose
  .connect(dbConnectionString.replace("<password>", password), {
    retryWrites: true,
    w: "majority",
  })
  .then(() => console.log(chalk.green("✓ Connected to MongoDB Atlas")))
  .catch((err) => {
    console.error(
      chalk.red("❌ MongoDB Atlas connection failed:"),
      err.message
    );
    process.exit(1);
  });
