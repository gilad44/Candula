const joi = require("joi");

const validateUserUpdate = (user) => {
  const schema = joi.object({
    name: joi
      .object({
        first: joi.string().min(2).max(50).required(),
        last: joi.string().min(2).max(50).required(),
      })
      .required(),
    email: joi.string().email().required(),
    phone: joi.string().pattern(/^[0-9\-+\s()]{10,15}$/),
    address: joi.object({
      street: joi.string().min(2).max(100),
      city: joi.string().min(2).max(50),
      state: joi.string().min(2).max(50),
      zip: joi.string().min(2).max(20),
      country: joi.string().min(2).max(50),
    }),
  });
  return schema.validate(user);
};

module.exports = validateUserUpdate;
