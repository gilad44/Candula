const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: [String], required: true },
  shape: { type: String, required: true },
  isSet: { type: Boolean, required: true },
  price: { type: Number, min: 0, required: true },
  tags: { type: [String], required: true },
  variants: { type: [Object], required: false },
  scent: { type: String, required: false },
  sku: { type: String, required: false },
  style: { type: String, required: false },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
