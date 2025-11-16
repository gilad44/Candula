const ordersDataAccessService = require("../models/ordersDataAccessService");

const getAllOrders = async () => {
  return await ordersDataAccessService.getAllOrders();
};

const getUserOrders = async (userId) => {
  return await ordersDataAccessService.getOrdersByUserId(userId);
};

const getOrder = async (orderId) => {
  return await ordersDataAccessService.getOrderById(orderId);
};

const createNewOrder = async (orderData) => {
  if (!orderData.userId) {
    throw new Error("User ID is required");
  }
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error("Order items are required");
  }
  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    throw new Error("Total amount must be greater than 0");
  }
  if (!orderData.shippingAddress) {
    throw new Error("Shipping address is required");
  }

  return await ordersDataAccessService.createOrder(orderData);
};

const updateStatus = async (orderId, status) => {
  return await ordersDataAccessService.updateOrderStatus(orderId, status);
};

const removeOrder = async (orderId) => {
  return await ordersDataAccessService.deleteOrder(orderId);
};

module.exports = {
  getAllOrders,
  getUserOrders,
  getOrder,
  createNewOrder,
  updateStatus,
  removeOrder,
};
