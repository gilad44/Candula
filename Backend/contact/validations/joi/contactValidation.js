const joi = require("joi");

const contactValidation = (contact) => {
  const schema = joi.object({
    name: joi.string().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
    subject: joi.string().min(5).max(200).required().messages({
      "string.empty": "Subject is required",
      "string.min": "Subject must be at least 5 characters long",
      "string.max": "Subject cannot exceed 200 characters",
    }),
    message: joi.string().min(10).max(1000).required().messages({
      "string.empty": "Message is required",
      "string.min": "Message must be at least 10 characters long",
      "string.max": "Message cannot exceed 1000 characters",
    }),
  });

  return schema.validate(contact);
};

module.exports = contactValidation;
