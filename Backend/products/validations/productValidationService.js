const validateProductWithJoi = require("./joi/validateProductWithJoi");

const validator = undefined || "joi";

const validateProduct = (product) => {
  if (validator === "joi") {
    return validateProductWithJoi(product);
  }
};
module.exports = validateProduct;
