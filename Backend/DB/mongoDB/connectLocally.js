const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect("mongodb://localhost:27017/Candula", {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log(chalk.cyan("✓ Connected locally to MongoDB"));
  })
  .catch((err) => {
    console.error(
      chalk.red("❌ Local MongoDB connection failed:"),
      err.message
    );
    console.error(chalk.yellow("Make sure MongoDB is running locally"));
  });
