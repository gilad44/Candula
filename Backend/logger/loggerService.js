const express = require("express");
const app = express();
const morganLogger = require("./loggers/morganLogger");
const { dailyFileLogger } = require("./loggers/dailyFileLogger");

const LOGGER = "morgan";

if (LOGGER === "morgan") {
  // Use the enhanced daily file logger that writes to both file and console
  app.use(dailyFileLogger);

  // Also include the original morgan logger for backward compatibility if needed
  // app.use(morganLogger);
}

module.exports = app;
