const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("../users/models/mongoDB/User");
const Order = require("../orders/models/mongoDB/Order");
const Product = require("../products/models/mongoDB/Product");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Candula", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample users data
const users = [
  {
    name: {
      first: "שרה",
      middle: "",
      last: "כהן",
    },
    phone: "050-1234567",
    email: "sarah.cohen@example.com",
    password: "Aa123456!",
    address: {
      state: "ישראל",
      country: "ישראל",
      city: "תל אביב",
      street: "דיזנגוף",
      houseNumber: 123,
      zip: 6423312,
    },
    isBusiness: false,
    role: "user",
  },
  {
    name: {
      first: "דוד",
      middle: "",
      last: "לוי",
    },
    phone: "052-2345678",
    email: "david.levi@example.com",
    password: "Aa123456!",
    address: {
      state: "ישראל",
      country: "ישראל",
      city: "ירושלים",
      street: "יפו",
      houseNumber: 45,
      zip: 9422306,
    },
    isBusiness: false,
    role: "user",
  },
  {
    name: {
      first: "מירי",
      middle: "",
      last: "אברהם",
    },
    phone: "054-3456789",
    email: "miri.abraham@example.com",
    password: "Aa123456!",
    address: {
      state: "ישראל",
      country: "ישראל",
      city: "חיפה",
      street: "הרצל",
      houseNumber: 78,
      zip: 3310152,
    },
    isBusiness: false,
    role: "user",
  },
];

// Sample orders data (will be created for each user)
const getOrdersForUser = (user, productId) => [
  {
    items: [
      {
        productId: productId,
        quantity: 2,
        price: 45.99,
      },
    ],
    totalAmount: 91.98,
    shippingAddress: {
      firstName: user.name.first,
      lastName: user.name.last,
      street: user.address.street + " " + user.address.houseNumber,
      city: user.address.city,
      postalCode: user.address.zip.toString(),
      country: user.address.country,
      phone: user.phone,
    },
    status: "pending",
    paymentMethod: "credit_card",
    shippingMethod: "standard",
    notes: `הזמנה של ${user.name.first} ${user.name.last}`,
  },
  {
    items: [
      {
        productId: productId,
        quantity: 1,
        price: 35.5,
      },
    ],
    totalAmount: 35.5,
    shippingAddress: {
      firstName: user.name.first,
      lastName: user.name.last,
      street: user.address.street + " " + user.address.houseNumber,
      city: user.address.city,
      postalCode: user.address.zip.toString(),
      country: user.address.country,
      phone: user.phone,
    },
    status: "confirmed",
    paymentMethod: "paypal",
    shippingMethod: "express",
    notes: `הזמנה שנייה של ${user.name.first}`,
  },
];

async function createTestData() {
  try {
    console.log("Starting to create test data...");

    // First, get or create a sample product
    let product = await Product.findOne();
    if (!product) {
      console.log("No products found, creating a sample product...");
      product = new Product({
        title: "נר ארומתרפי",
        subtitle: "נר ריחני בעבודת יד",
        description: "נר ארומתרפי איכותי עם ריח לבנדר מרגיע",
        phone: "050-0000000",
        email: "info@candula.com",
        web: "https://candula.com",
        image: {
          url: "https://example.com/candle.jpg",
          alt: "נר ארומתרפי",
        },
        address: {
          state: "ישראל",
          country: "ישראל",
          city: "תל אביב",
          street: "רוטשילד",
          houseNumber: 1,
          zip: 6423312,
        },
        price: 45.99,
        category: "נרות ארומתרפיה",
        likes: [],
        user_id: "60d5ecb74b24c32d7c8b4567", // dummy user id
      });
      await product.save();
      console.log("Sample product created:", product.title);
    }

    // Create users and orders
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      // Create user
      const user = new User(userData);
      await user.save();
      console.log(
        `User created: ${user.name.first} ${user.name.last} (${user.email})`
      );

      // Create orders for this user
      const orderTemplates = getOrdersForUser(userData, product._id);

      for (let j = 0; j < orderTemplates.length; j++) {
        const orderData = orderTemplates[j];
        orderData.userId = user._id;

        const order = new Order(orderData);
        await order.save();
        console.log(
          `Order created for ${user.name.first}: Order ID ${order._id}, Status: ${order.status}, Amount: ₪${order.totalAmount}`
        );
      }
    }

    console.log("Test data creation completed successfully!");
    console.log("\nSummary:");
    console.log("- 3 users created");
    console.log("- 2 orders created for each user (6 total orders)");
    console.log("- Orders have different statuses: pending, confirmed");
    console.log("\nYou can now check the admin pages to see the data!");
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createTestData();
