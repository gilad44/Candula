const jwt = require("jsonwebtoken");
const config = require("config");
const key = config.get("JWT_KEY");

const generateAuthToken = (user) => {
  const { _id, role, isBusiness } = user;
  const token = jwt.sign({ _id, role, isBusiness }, key);
  return token;
};

const verifyToken = (token) => {
  try {
    const userData = jwt.verify(token, key);
    return userData;
  } catch (error) {
    return null;
  }
};

module.exports = { generateAuthToken, verifyToken };
