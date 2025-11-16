const joi = require("joi");

const orderValidation = (order) => {
  const itemSchema = joi.object({
    productId: joi.string().required().messages({
      "string.empty": "מזהה המוצר נדרש",
      "any.required": "מזהה המוצר נדרש",
    }),
    quantity: joi.number().integer().min(1).required().messages({
      "number.base": "הכמות חייבת להיות מספר",
      "number.integer": "הכמות חייבת להיות מספר שלם",
      "number.min": "הכמות חייבת להיות לפחות 1",
      "any.required": "הכמות נדרשת",
    }),
    price: joi.number().min(0).required().messages({
      "number.base": "המחיר חייב להיות מספר",
      "number.min": "המחיר חייב להיות חיובי",
      "any.required": "המחיר נדרש",
    }),
    selectedVariant: joi
      .object({
        color: joi.string().allow("").optional(),
        size: joi.string().allow("").optional(),
        material: joi.string().allow("").optional(),
      })
      .optional(),
  });

  const addressSchema = joi.object({
    firstName: joi.string().min(2).max(50).required().messages({
      "string.empty": "שם פרטי נדרש",
      "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
      "string.max": "שם פרטי לא יכול להכיל יותר מ-50 תווים",
      "any.required": "שם פרטי נדרש",
    }),
    lastName: joi.string().min(2).max(50).required().messages({
      "string.empty": "שם משפחה נדרש",
      "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
      "string.max": "שם משפחה לא יכול להכיל יותר מ-50 תווים",
      "any.required": "שם משפחה נדרש",
    }),
    street: joi.string().min(5).max(100).required().messages({
      "string.empty": "כתובת רחוב נדרשת",
      "string.min": "כתובת רחוב חייבת להכיל לפחות 5 תווים",
      "string.max": "כתובת רחוב לא יכולה להכיל יותר מ-100 תווים",
      "any.required": "כתובת רחוב נדרשת",
    }),
    city: joi.string().min(2).max(50).required().messages({
      "string.empty": "עיר נדרשת",
      "string.min": "עיר חייבת להכיל לפחות 2 תווים",
      "string.max": "עיר לא יכולה להכיל יותר מ-50 תווים",
      "any.required": "עיר נדרשת",
    }),
    postalCode: joi
      .string()
      .pattern(/^\d{5,7}$/)
      .required()
      .messages({
        "string.empty": "מיקוד נדרש",
        "string.pattern.base": "מיקוד חייב להיות 5-7 ספרות",
        "any.required": "מיקוד נדרש",
      }),
    country: joi.string().optional(),
    phone: joi
      .string()
      .pattern(/^05\d{8}$/)
      .required()
      .messages({
        "string.empty": "מספר טלפון נדרש",
        "string.pattern.base": "מספר טלפון חייב להיות בפורמט 05XXXXXXXX",
        "any.required": "מספר טלפון נדרש",
      }),
  });

  const schema = joi.object({
    userId: joi.string().optional(), // Will be set by the server
    items: joi.array().items(itemSchema).min(1).required().messages({
      "array.min": "לפחות מוצר אחד נדרש בהזמנה",
      "any.required": "פריטי הזמנה נדרשים",
    }),
    totalAmount: joi.number().min(0).required().messages({
      "number.base": "סכום כולל חייב להיות מספר",
      "number.min": "סכום כולל חייב להיות חיובי",
      "any.required": "סכום כולל נדרש",
    }),
    status: joi
      .string()
      .valid(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      )
      .optional(),
    shippingAddress: addressSchema.required().messages({
      "any.required": "כתובת משלוח נדרשת",
    }),
    paymentMethod: joi
      .string()
      .valid("credit_card", "paypal", "bank_transfer", "cash_on_delivery")
      .required()
      .messages({
        "any.only": "אמצעי תשלום לא תקין",
        "any.required": "אמצעי תשלום נדרש",
      }),
    shippingMethod: joi
      .string()
      .valid("standard", "express", "overnight")
      .required()
      .messages({
        "any.only": "שיטת משלוח לא תקינה",
        "any.required": "שיטת משלוח נדרשת",
      }),
    notes: joi.string().max(500).optional().allow("").messages({
      "string.max": "הערות לא יכולות להכיל יותר מ-500 תווים",
    }),
    shippingCost: joi.number().min(0).optional(),
    tax: joi.number().min(0).optional(),
  });

  return schema.validate(order);
};

module.exports = orderValidation;
