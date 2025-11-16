const Order = require("../models/mongoDB/Order");
const User = require("../../users/models/mongoDB/User");
const normalizeOrder = require("../helpers/normalizeOrder");

// Get all orders for admin
const getAllOrders = async () => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

// Get orders by user ID
const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

// Create new order
const createOrder = async (orderData) => {
  try {
    // Normalize the order data
    const normalizedOrder = normalizeOrder(orderData);

    // Create the order
    const order = new Order(normalizedOrder);
    const savedOrder = await order.save();

    // Update user's orders array (for compatibility with frontend)
    try {
      await User.findOneAndUpdate(
        { _id: orderData.userId },
        {
          $push: { orders: { $each: [savedOrder.toObject()], $position: 0 } },
          $set: { updatedAt: new Date() },
        }
      );
    } catch (userUpdateError) {
      console.warn(
        "Failed to update user orders array:",
        userUpdateError.message
      );
      // Don't throw error here as the main order was saved successfully
    }

    return savedOrder;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    // Update the order in user's orders array too
    try {
      await User.updateOne(
        { "orders._id": orderId },
        {
          $set: {
            "orders.$.status": status,
            "orders.$.updatedAt": new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } catch (userUpdateError) {
      console.warn(
        "Failed to update order status in user array:",
        userUpdateError.message
      );
    }

    return order;
  } catch (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }
};

// Delete order (admin only)
const deleteOrder = async (orderId) => {
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Remove from user's orders array
    try {
      await User.updateOne(
        { userId: order.userId },
        {
          $pull: { orders: { _id: orderId } },
          $set: { updatedAt: new Date() },
        }
      );
    } catch (userUpdateError) {
      console.warn(
        "Failed to remove order from user array:",
        userUpdateError.message
      );
    }

    return order;
  } catch (error) {
    throw new Error(`Failed to delete order: ${error.message}`);
  }
};

module.exports = {
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
