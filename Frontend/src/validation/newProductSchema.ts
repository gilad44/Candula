import Joi from "joi";

export const newProductSchema = Joi.object({
  filename: Joi.string().required(),
  type: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  color: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
  shape: Joi.string().required(),
  isSet: Joi.boolean().required(),
  price: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string()).required(),
  variants: Joi.array().items(Joi.object()).optional(),
  scent: Joi.string().optional(),
  sku: Joi.string().optional(),
});
