// Environment Configuration
export const config = {
  // App Info
  APP_NAME: "קנדולה - Candula",
  APP_DESCRIPTION: "נרות דקורטיביים ריחניים בעבודת יד",
  APP_VERSION: "1.0.0",

  // API URLs (for future backend integration)
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",

  // Google OAuth (for Google Login integration)
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",

  // Payment Integration (for future)
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
  PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || "",

  // App Settings
  DEFAULT_LANGUAGE: "he",
  DEFAULT_CURRENCY: "ILS",
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 100,

  // Theme Colors
  THEME: {
    PRIMARY: "#7f6000",
    SECONDARY: "#cd853f",
    SUCCESS: "#4caf50",
    ERROR: "#f44336",
    WARNING: "#ff9800",
    INFO: "#2196f3",
    BACKGROUND: "#f7efa9",
  },

  // Contact Info
  CONTACT: {
    EMAIL: "info@candula.com",
    PHONE: "+972-50-123-4567",
    ADDRESS: "רחוב הנרות 123, תל אביב, ישראל",
    FACEBOOK: "https://facebook.com/candula",
    INSTAGRAM: "https://instagram.com/candula",
    WHATSAPP: "+972501234567",
  },

  // Business Settings
  BUSINESS: {
    VAT_RATE: 0.17, // 17% VAT in Israel
    FREE_SHIPPING_THRESHOLD: 200,
    STANDARD_SHIPPING_COST: 15,
    EXPRESS_SHIPPING_COST: 25,
    OVERNIGHT_SHIPPING_COST: 50,
    CURRENCY_SYMBOL: "₪",
  },

  // Image Settings
  IMAGES: {
    PLACEHOLDER: "/images/placeholder-candle.jpg",
    LOGO: "/images/logo.jpg",
    BANNER: "/images/Banner/",
    PRODUCTS: "/images/",
  },

  // SEO & Meta
  SEO: {
    KEYWORDS:
      "נרות, נרות דקורטיביים, נרות ריחניים, נרות בעבודת יד, נרות איכותיים, candles, decorative candles, scented candles, handmade candles",
    AUTHOR: "Candula Team",
    ROBOTS: "index, follow",
    OG_IMAGE: "/images/og-image.jpg",
  },

  // Development Settings
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // Analytics (for future)
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_ID || "",
  FACEBOOK_PIXEL_ID: import.meta.env.VITE_FB_PIXEL_ID || "",

  // Error Reporting (for future)
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || "",

  // Feature Flags
  FEATURES: {
    ENABLE_REVIEWS: false,
    ENABLE_WISHLIST: true,
    ENABLE_LIVE_CHAT: false,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_SOCIAL_LOGIN: true,
    ENABLE_MULTIPLE_LANGUAGES: false,
    ENABLE_PWA: false,
    ENABLE_ANALYTICS: false,
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    USER: "user",
    CART: "cart",
    FAVORITES: "favorites_",
    THEME: "theme",
    LANGUAGE: "language",
  },
};

export default config;
