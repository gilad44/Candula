const normalizeOrder = (orderData) => {
  return {
    userId: orderData.userId,
    items: orderData.items || [],
    totalAmount: orderData.totalAmount || 0,
    status: orderData.status || "pending",
    shippingAddress: {
      firstName: orderData.shippingAddress?.firstName || "",
      lastName: orderData.shippingAddress?.lastName || "",
      street: orderData.shippingAddress?.street || "",
      city: orderData.shippingAddress?.city || "",
      postalCode: orderData.shippingAddress?.postalCode || "",
      country: orderData.shippingAddress?.country || "Israel",
      phone: orderData.shippingAddress?.phone || "",
    },
    paymentMethod: orderData.paymentMethod || "credit_card",
    shippingMethod: orderData.shippingMethod || "standard",
    notes: orderData.notes || "",
    shippingCost: orderData.shippingCost || 0,
    tax: orderData.tax || 0,
    createdAt: orderData.createdAt || new Date(),
    updatedAt: orderData.updatedAt || new Date(),
  };
};

module.exports = normalizeOrder;
