const data = require("./initialData.json");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeProduct = require("../products/helpers/normalizeProduct");
const { register } = require("../users/models/usersDataAccessService");

const { generateUserPassword } = require("../users/helpers/bcrypt");
const chalk = require("chalk");

const generateInitialProducts = async () => {
  const { products } = data;
  for (const productData of products) {
    try {
      const userID = "6376274068d78742d84f31d2";
      product = await normalizeProduct(productData, userID);
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  }
};
const generateInitialusers = async () => {
  const { users } = data;
  for (const userData of users) {
    try {
      const user = await normalizeUser(userData);
      user.password = generateUserPassword(user.password);
      await register(user);
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  }
};

module.exports = { generateInitialProducts, generateInitialusers };
