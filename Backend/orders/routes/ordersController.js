const express = require("express");
const auth = require("../../auth/authService");
const orderService = require("../services/orderService");
const validateOrder = require("../validations/orderValidationService");

const router = express.Router();

// GET /orders - Get all orders (admin only)
router.get("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Admin privileges required.");
    }

    const orders = await orderService.getAllOrders();
    res.send(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).send("Internal server error");
  }
});

// GET /orders/my - Get current user's orders
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.send(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send("Internal server error");
  }
});

// GET /orders/:id - Get specific order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.id);

    // Check if user owns this order or is admin
    if (order.userId !== req.user._id && req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    res.send(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    if (error.message === "Order not found") {
      return res.status(404).send("Order not found");
    }
    res.status(500).send("Internal server error");
  }
});

// POST /orders - Create new order
router.post("/", auth, async (req, res) => {
  try {
    // Validate order data
    const { error } = validateOrder(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).send(errorMessage);
    }

    // Add user ID to order data
    const orderData = {
      ...req.body,
      userId: req.user._id,
    };

    const order = await orderService.createNewOrder(orderData);
    res.status(201).send(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send(error.message || "Internal server error");
  }
});

// PATCH /orders/:id/status - Update order status (admin only)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Admin privileges required.");
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).send("Status is required");
    }

    const order = await orderService.updateStatus(req.params.id, status);
    res.send(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error.message === "Order not found") {
      return res.status(404).send("Order not found");
    }
    if (error.message === "Invalid order status") {
      return res.status(400).send("Invalid order status");
    }
    res.status(500).send("Internal server error");
  }
});

// DELETE /orders/:id - Delete order (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Admin privileges required.");
    }

    const order = await orderService.removeOrder(req.params.id);
    res.send({ message: "Order deleted successfully", order });
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error.message === "Order not found") {
      return res.status(404).send("Order not found");
    }
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
