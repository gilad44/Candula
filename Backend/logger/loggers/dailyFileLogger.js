const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const chalk = require("chalk");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "..", "logs");
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
const getLogFilePath = () => {
  const dateString = getCurrentDateString();
  return path.join(logsDir, `access-${dateString}.log`);
};

// Custom stream that writes to daily log files
let currentDate = getCurrentDateString();
let currentStream = null;

const getDailyStream = () => {
  const today = getCurrentDateString();

  // If date has changed, close current stream and create a new one
  if (today !== currentDate || !currentStream) {
    if (currentStream) {
      currentStream.end();
    }
    currentDate = today;
    currentStream = fs.createWriteStream(getLogFilePath(), { flags: "a" });
  }

  return currentStream;
};

// Function to format timestamp in Israel timezone
const getIsraelTimestamp = () => {
  const now = new Date();
  return now
    .toLocaleString("en-GB", {
      timeZone: "Asia/Jerusalem",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$1/$2/$3:$4");
};

// Custom Morgan token for Israel timestamp
morgan.token("israel-date", () => {
  return getIsraelTimestamp();
});

// Custom Morgan format for clear, simple readability
const customFormat = ":israel-date :method :url → :status (:response-time ms)";

// Create morgan logger for file output
const fileLogger = morgan(customFormat, {
  stream: {
    write: (message) => {
      const stream = getDailyStream();
      stream.write(message);
    },
  },
});

// Create morgan logger for console output with colors
const consoleLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const time = tokens["response-time"](req, res);

  const logMessage = `${getIsraelTimestamp()} ${method} ${url} → ${status} (${time}ms)`;

  if (status >= 400) {
    return chalk.red(`❌ ${logMessage}`);
  } else if (status >= 300) {
    return chalk.yellow(`↩️  ${logMessage}`);
  } else {
    return chalk.green(`✅ ${logMessage}`);
  }
});

// Combined middleware
const dailyFileLogger = (req, res, next) => {
  // First run the file logger
  fileLogger(req, res, () => {
    // Then run the console logger
    consoleLogger(req, res, next);
  });
};

// Function to clean up old log files (keep only last 30 days)
const cleanupOldLogs = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const files = fs.readdirSync(logsDir);
    files.forEach((file) => {
      if (file.startsWith("access-") && file.endsWith(".log")) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(chalk.yellow(`Cleaned up old log file: ${file}`));
        }
      }
    });
  } catch (error) {
    console.error(chalk.red("Error cleaning up old logs:", error.message));
  }
};

// Run cleanup on startup
cleanupOldLogs();

// Schedule daily cleanup (run every 24 hours)
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);

module.exports = {
  dailyFileLogger,
  fileLogger,
  consoleLogger,
  cleanupOldLogs,
  getLogFilePath,
};
