import { config } from "../config/config";
import type {
  Address,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
} from "../types/User";

// Type for creating orders (excludes server-generated fields)
type CreateOrderRequest = {
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  notes?: string;
  shippingCost: number;
  tax: number;
};

const API_BASE_URL = config.API_BASE_URL;

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  // First try to get token directly
  const directToken = localStorage.getItem("token");
  if (directToken) {
    return directToken;
  }

  // Fallback to user object (for compatibility)
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.token || null;
  }
  return null;
};

// Create headers with auth token
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["x-auth-token"] = token;
  }

  return headers;
};

// Helper function to translate API errors to Hebrew
const translateError = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (message.includes("unauthorized") || message.includes("401")) {
    return "נדרש להתחבר כדי לבצע הזמנה";
  }
  if (message.includes("validation") || message.includes("400")) {
    return "פרטי ההזמנה אינם תקינים, אנא בדוק את הפרטים";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "בעיית חיבור לשרת, נסה שוב";
  }
  if (message.includes("server") || message.includes("500")) {
    return "שגיאת שרת, נסה שוב מאוחר יותר";
  }

  return "שגיאה בביצוע הזמנה, נסה שוב";
};

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Order creation failed:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
          orderData,
        });

        // If it's a validation error (400), show the Hebrew error message from backend
        if (response.status === 400 && errorText) {
          throw new Error(errorText);
        }

        const error = new Error(
          errorText || `HTTP error! status: ${response.status}`
        );
        throw new Error(translateError(error));
      }

      const order = await response.json();
      return order;
    } catch (error) {
      // If it's already a translated error, throw as is, otherwise translate
      if (error instanceof Error && error.message.includes("שגיאה")) {
        throw error;
      }
      throw new Error(translateError(error as Error));
    }
  },

  // Get user's orders
  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my`, {
        method: "GET",
        headers: createHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Get specific order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "GET",
        headers: createHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Get all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "GET",
        headers: createHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          errorText || `HTTP error! status: ${response.status}`
        );
        throw new Error(translateError(error));
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      if (error instanceof Error && error.message.includes("שגיאה")) {
        throw error;
      }
      throw new Error("שגיאה בטעינת ההזמנות");
    }
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Delete order (admin only)
  async deleteOrder(
    orderId: string
  ): Promise<{ message: string; order: Order }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: createHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
};
