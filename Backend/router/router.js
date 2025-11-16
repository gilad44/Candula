const express = require("express");
const router = express.Router();
const { handleError } = require("../utils/errorHandler");

const productsController = require("../products/routes/productsController");
const usersController = require("../users/routes/usersController");
const ordersController = require("../orders/routes/ordersController");
const contactController = require("../contact/routes/contactController");

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "Candula API is running" });
});

router.use("/products", productsController);
router.use("/users", usersController);
router.use("/orders", ordersController);
router.use("/contact", contactController);

router.use((req, res) => handleError(res, 404, "Route not found"));

module.exports = router;
