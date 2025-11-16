const joi = require("joi");

const checkoutValidation = (order) => {
  const schema = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    street: joi.string().min(5).max(100).required(),
    city: joi.string().min(2).max(50).required(),
    postalCode: joi
      .string()
      .pattern(/^\d{5,7}$/)
      .required(),
    phone: joi
      .string()
      .pattern(/^[0-9\-+\s()]{10,15}$/)
      .required(),
    paymentMethod: joi
      .string()
      .valid("credit_card", "paypal", "bank_transfer", "cash_on_delivery")
      .required(),
    shippingMethod: joi
      .string()
      .valid("standard", "express", "overnight")
      .required(),
    orderNotes: joi.string().max(500).optional().allow(""),
  });
  return schema.validate(order);
};

module.exports = checkoutValidation;
