export type User = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  favorites: string[];
  addresses?: Address[];
  orders?: Order[];
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified?: boolean;
  preferences?: UserPreferences;
};

export type Address = {
  id: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
};

export type UserPreferences = {
  language: "he" | "en";
  currency: "ILS" | "USD" | "EUR";
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketing: boolean;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  discount?: number;
  shippingCost: number;
  tax: number;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  selectedVariant?: {
    color?: string;
    size?: string;
    scent?: string;
  };
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "bank_transfer"
  | "cash_on_delivery";

export type ShippingMethod = "standard" | "express" | "overnight" | "pickup";

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}
