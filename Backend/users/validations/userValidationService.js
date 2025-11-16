const signupValidation = require("./joi/signupValidation");
const loginValidation = require("./joi/loginValidation");
const userUpdateValidation = require("./joi/userUpdateValidation");

const validator = undefined || "joi";

const validateSignup = (user) => {
  if (validator === "joi") {
    return signupValidation(user);
  }
};
const validateLogin = (user) => {
  if (validator === "joi") {
    return loginValidation(user);
  }
};
module.exports = { validateLogin, validateSignup };
