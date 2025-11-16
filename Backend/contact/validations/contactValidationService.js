const contactValidation = require("./joi/contactValidation");

const validator = undefined || "joi";

const validateContact = (contact) => {
  if (validator === "joi") {
    return contactValidation(contact);
  }
};

module.exports = { validateContact };
