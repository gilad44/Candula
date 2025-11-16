const Product = require("../models/mongoDB/Product");
const { handleBadRequest } = require("../../utils/errorHandler");
const db = process.env.DB || "MONGODB";

exports.find = async () => {
  if (db === "MONGODB") {
    try {
      const products = await Product.find();
      return Promise.resolve(products);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};
exports.findMyProducts = async (userID) => {
  if (db === "MONGODB") {
    try {
      return Promise.resolve(`My products: ${userID}`);
    } catch (error) {
      error.status = 404;
      return Promise.reject(error);
    }
  }
};
exports.findOne = async (productID) => {
  if (db === "MONGODB") {
    try {
      const product = await Product.findById(productID);
      if (!product) {
        throw new Error("Couldn't find product in db");
      } else {
        return Promise.resolve(product);
      }
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve();
};
exports.createProduct = async (normalizedProduct) => {
  if (db === "MONGODB") {
    try {
      let product = new Product(normalizedProduct);
      product = await product.save();
      return Promise.resolve(product);
    } catch (error) {
      error.status = 404;
      return Promise.reject(error);
    }
  }
};
exports.updateProduct = async (productID, normalizedProduct) => {
  if (db === "MONGODB") {
    try {
      const product = await Product.findByIdAndUpdate(
        productID,
        normalizedProduct,
        { new: true }
      );
      if (!product) {
        throw new Error("Couldn't find product in db");
      } else {
        return Promise.resolve(product);
      }
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};
exports.likeProduct = async (productID, userID) => {
  if (db === "MONGODB") {
    try {
      const product = await Product.findById(productID);
      if (!product) {
        throw new Error("Couldn't find product in db");
      } else {
        if (product.likes.includes(userID)) {
          product.likes = product.likes.filter((id) => id !== userID);
          await product.save();
          return Promise.resolve(` ${product.name} unliked`);
        } else {
          product.likes.push(userID);
          await product.save();
          return Promise.resolve(` ${product.name} liked`);
        }
      }
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};
exports.removeProduct = async (productID) => {
  if (db === "MONGODB") {
    try {
      const product = await Product.findByIdAndDelete(productID);
      if (!product) {
        throw new Error("Couldn't find product in db");
      } else return Promise.resolve(product);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Product not found in mongoDB");
};
