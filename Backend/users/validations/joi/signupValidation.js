const joi = require("joi");

const signupValidation = (user) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const schema = joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Please enter a valid email address",
      }),
    password: joi.string().pattern(passwordRegex).required().messages({
      "string.pattern.base":
        "Password must be at least 6 characters with uppercase, lowercase, number, and special character (@$!%*?&)",
    }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
  });
  return schema.validate(user);
};
module.exports = signupValidation;
