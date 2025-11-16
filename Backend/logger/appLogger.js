const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to get current date in DD-MM-YYYY format (Israel timezone)
const getCurrentDateString = () => {
  const now = new Date();
  // Convert to Israel timezone (UTC+2 standard, UTC+3 during DST)
  const israelTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );
  const year = israelTime.getFullYear();
  const month = String(israelTime.getMonth() + 1).padStart(2, "0");
  const day = String(israelTime.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

// Function to get log file path for current date
const getLogFilePath = (logType = "app") => {
  const dateString = getCurrentDateString();
  return path.join(logsDir, `${logType}-${dateString}.log`);
};

// Function to get timestamp in Israel timezone
const getIsraelTimestamp = () => {
  const now = new Date();
  return now.toLocaleString("en-GB", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// Function to write log entry with simple, clear format
const writeLog = (level, message, logType = "app", data = null) => {
  const timestamp = getIsraelTimestamp();

  // Create a simple, readable log entry
  let logLine;
  if (data) {
    logLine = `[${timestamp}] ${level.toUpperCase()}: ${message} | ${JSON.stringify(
      data
    )}\n`;
  } else {
    logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  }

  const logFilePath = getLogFilePath(logType);

  try {
    fs.appendFileSync(logFilePath, logLine, { encoding: "utf8" });
  } catch (error) {
    console.error(chalk.red("Failed to write to log file:", error.message));
  }
};

// Logger object with clear, simple console output
const logger = {
  info: (message, data = null, logType = "app") => {
    console.log(chalk.blue(`ℹ️  ${message}`));
    writeLog("info", message, logType, data);
  },

  warn: (message, data = null, logType = "app") => {
    console.log(chalk.yellow(`⚠️  ${message}`));
    writeLog("warn", message, logType, data);
  },

  error: (message, data = null, logType = "app") => {
    console.log(chalk.red(`❌ ${message}`));
    writeLog("error", message, logType, data);
  },

  debug: (message, data = null, logType = "app") => {
    if (process.env.NODE_ENV === "development") {
      console.log(chalk.magenta(`🔍 ${message}`));
      writeLog("debug", message, logType, data);
    }
  },

  success: (message, data = null, logType = "app") => {
    console.log(chalk.green(`✅ ${message}`));
    writeLog("success", message, logType, data);
  },

  // Specific loggers for different types
  auth: (level, message, data = null) => {
    logger[level](message, data, "auth");
  },

  database: (level, message, data = null) => {
    logger[level](message, data, "database");
  },

  api: (level, message, data = null) => {
    logger[level](message, data, "api");
  },
};

module.exports = {
  logger,
  writeLog,
  getLogFilePath,
  getCurrentDateString,
  getIsraelTimestamp,
};
