const {
  find,
  findMyProducts,
  findOne,
  createProduct,
  updateProduct,
  likeProduct,
  removeProduct,
} = require("../models/productsDataAccessService");
const validateProduct = require("../validations/productValidationService");
const normalizeProduct = require("../helpers/normalizeProduct");

exports.getProducts = async () => {
  const products = await find();
  return products;
};

exports.getMyProducts = async (userID) => {
  const myProducts = await findMyProducts(userID);
  return myProducts;
};

exports.getOneProduct = async (productID) => {
  const product = await findOne(productID);
  return product;
};

exports.create = async (rawProduct) => {
  const { error } = validateProduct(rawProduct);
  if (error) {
    throw error;
  }
  let product = normalizeProduct(rawProduct);
  product = await createProduct(product);
  return product;
};

exports.update = async (productId, rawProduct) => {
  const updatedProduct = await updateProduct(productId, rawProduct);
  return updatedProduct;
};

exports.like = async (product, productID) => {
  product = await likeProduct(product, productID);
  return product;
};

exports.remove = async (id) => {
  const product = await removeProduct(id);
  return product;
};
