const chalk = require("chalk");
const express = require("express");
const { handleError } = require("../../utils/errorHandler");

const { getProducts } = require("../services/productService");
const { getMyProducts } = require("../services/productService");
const { getOneProduct } = require("../services/productService");
const { create } = require("../services/productService");
const { update } = require("../services/productService");
const { like } = require("../services/productService");
const { remove } = require("../services/productService");
const router = express.Router();

// the paths in each route.something is what comes after "/products" or "/users"
// etc
router.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    return res.send(products);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.get("/my-products", async (req, res) => {
  try {
    const userID = "45654";
    const myProducts = await getMyProducts(userID);
    return res.send(myProducts);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getOneProduct(id);
    return res.send(product);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const product = await create(req.body);
    return res.send(product);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await update(id, req.body);
    return res.send(product);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.query.userID;
    const product = await like(id, userID);
    return res.send(product);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await remove(id);
    return res.send(product);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

module.exports = router;
