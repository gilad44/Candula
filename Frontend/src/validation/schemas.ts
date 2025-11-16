import Joi from "joi";

export const checkoutSchema = Joi.object({
  // Shipping Address
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם פרטי הוא שדה חובה",
    "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
    "string.max": "שם פרטי יכול להכיל עד 50 תווים",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם משפחה הוא שדה חובה",
    "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
    "string.max": "שם משפחה יכול להכיל עד 50 תווים",
  }),

  street: Joi.string().min(5).max(100).required().messages({
    "string.empty": "כתובת היא שדה חובה",
    "string.min": "כתובת חייבת להכיל לפחות 5 תווים",
    "string.max": "כתובת יכולה להכיל עד 100 תווים",
  }),

  city: Joi.string().min(2).max(50).required().messages({
    "string.empty": "עיר היא שדה חובה",
    "string.min": "שם העיר חייב להכיל לפחות 2 תווים",
    "string.max": "שם העיר יכול להכיל עד 50 תווים",
  }),

  postalCode: Joi.string()
    .pattern(/^\d{5,7}$/)
    .required()
    .messages({
      "string.empty": "מיקוד הוא שדה חובה",
      "string.pattern.base": "מיקוד חייב להכיל בין 5 ל-7 ספרות",
    }),

  phone: Joi.string()
    .pattern(/^05\d{8}$/)
    .required()
    .messages({
      "string.empty": "מספר טלפון הוא שדה חובה",
      "string.pattern.base": "מספר טלפון חייב להיות בפורמט 05XXXXXXXX",
    }),

  // Payment & Shipping
  paymentMethod: Joi.string()
    .valid("credit_card", "paypal", "bank_transfer", "cash_on_delivery")
    .required()
    .messages({
      "any.only": "אמצעי תשלום לא תקין",
      "string.empty": "יש לבחור אמצעי תשלום",
    }),

  shippingMethod: Joi.string()
    .valid("standard", "express", "overnight")
    .required()
    .messages({
      "any.only": "אמצעי משלוח לא תקין",
      "string.empty": "יש לבחור אמצעי משלוח",
    }),

  orderNotes: Joi.string().max(500).optional().allow("").messages({
    "string.max": "הערות יכולות להכיל עד 500 תווים",
  }),
});

export const profileSchema = Joi.object({
  name: {
    first: Joi.string().min(2).max(50).required().messages({
      "string.empty": "שם פרטי הוא שדה חובה",
      "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
      "string.max": "שם פרטי יכול להכיל עד 50 תווים",
    }),

    last: Joi.string().min(2).max(50).required().messages({
      "string.empty": "שם משפחה הוא שדה חובה",
      "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
      "string.max": "שם משפחה יכול להכיל עד 50 תווים",
    }),
  },

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת אימייל לא תקינה",
    }),

  phone: Joi.string()
    .pattern(/^[0-9\-+\s()]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "מספר טלפון לא תקין",
    }),
});

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "שם הוא שדה חובה",
    "string.min": "שם חייב להכיל לפחות 2 תווים",
    "string.max": "שם יכול להכיל עד 100 תווים",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת אימייל לא תקינה",
    }),

  subject: Joi.string().min(5).max(200).required().messages({
    "string.empty": "נושא הוא שדה חובה",
    "string.min": "נושא חייב להכיל לפחות 5 תווים",
    "string.max": "נושא יכול להכיל עד 200 תווים",
  }),

  message: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "הודעה היא שדה חובה",
    "string.min": "הודעה חייבת להכיל לפחות 10 תווים",
    "string.max": "הודעה יכולה להכיל עד 1000 תווים",
  }),
});

export const addressSchema = Joi.object({
  type: Joi.string().valid("home", "work", "other").required().messages({
    "any.only": "סוג כתובת לא תקין",
    "string.empty": "יש לבחור סוג כתובת",
  }),

  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם פרטי הוא שדה חובה",
    "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
    "string.max": "שם פרטי יכול להכיל עד 50 תווים",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם משפחה הוא שדה חובה",
    "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
    "string.max": "שם משפחה יכול להכיל עד 50 תווים",
  }),

  street: Joi.string().min(5).max(100).required().messages({
    "string.empty": "כתובת היא שדה חובה",
    "string.min": "כתובת חייבת להכיל לפחות 5 תווים",
    "string.max": "כתובת יכולה להכיל עד 100 תווים",
  }),

  city: Joi.string().min(2).max(50).required().messages({
    "string.empty": "עיר היא שדה חובה",
    "string.min": "שם העיר חייב להכיל לפחות 2 תווים",
    "string.max": "שם העיר יכול להכיל עד 50 תווים",
  }),

  postalCode: Joi.string()
    .pattern(/^\d{5,7}$/)
    .required()
    .messages({
      "string.empty": "מיקוד הוא שדה חובה",
      "string.pattern.base": "מיקוד חייב להכיל בין 5 ל-7 ספרות",
    }),

  country: Joi.string().min(2).max(50).required().messages({
    "string.empty": "מדינה היא שדה חובה",
    "string.min": "שם המדינה חייב להכיל לפחות 2 תווים",
    "string.max": "שם המדינה יכול להכיל עד 50 תווים",
  }),

  phone: Joi.string()
    .pattern(/^[0-9\-+\s()]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "מספר טלפון לא תקין",
    }),
});
