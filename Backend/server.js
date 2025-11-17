const express = require("express");
const router = require("./router/router");
const app = express();

const cors = require("./middleware/cors");
const {
  securityHeaders,
  apiSecurityHeaders,
  securityLogger,
} = require("./middleware/security");
const { handleError } = require("./utils/errorHandler");
const morgan = require("morgan");
const connectToDB = require("./DB/dbService");
const logger = require("./logger/loggerService");
const { logger: appLogger } = require("./logger/appLogger");
const config = require("config");
const { generateInitialusers } = require("./initialData/initialDataService");

// Apply security headers first
app.use(securityHeaders);
app.use(apiSecurityHeaders);
app.use(securityLogger);

app.use(cors);
app.use(logger);
app.use(express.json({ limit: "10mb" }));

// Temporary endpoint to seed initial data (REMOVE AFTER USE!)
app.get("/api/seed-initial-data", async (req, res) => {
  try {
    await generateInitialusers();
    res.json({ message: "Initial users created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/", router);

app.use((err, req, res, next) => {
  handleError(res, err.status || 500, err.message);
});

const PORT = config.get("PORT");
app.listen(PORT, () => {
  console.log(`Server Running on localhost: ${PORT}`);
  connectToDB();
});
