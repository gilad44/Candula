const config = require("config");

const connectToDB = () => {
  const env = config.get("NODE_ENV") || process.env.NODE_ENV || "development";

  if (env === "development") {
    require("./mongoDB/connectLocally");
  } else if (env === "production") {
    require("./mongoDB/connectToAtlas");
  }
};

module.exports = connectToDB;
