const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../users/models/mongoDB/User");
const config = require("config");
const chalk = require("chalk");

async function setupAdminForDeployment() {
  try {
    console.log(chalk.blue("🚀 Setting up admin for deployment..."));

    // Check for required environment variables
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log(chalk.red("❌ Missing required environment variables:"));
      console.log(chalk.yellow("   ADMIN_EMAIL - Admin email address"));
      console.log(chalk.yellow("   ADMIN_PASSWORD - Admin password"));
      process.exit(1);
    }

    // Connect to database
    const dbURI = "mongodb://localhost:27017/Candula";
    await mongoose.connect(dbURI);
    console.log(chalk.green("✅ Connected to database"));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(
        chalk.blue("ℹ️  Admin user already exists, skipping creation")
      );
      process.exit(0);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(chalk.red("❌ Invalid email format!"));
      process.exit(1);
    }

    // Validate password strength
    if (password.length < 8) {
      console.log(chalk.red("❌ Password must be at least 8 characters long!"));
      process.exit(1);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      role: "admin",
      name: {
        first: "Admin",
        last: "User",
      },
      favorites: [],
      addresses: [],
      orders: [],
      isEmailVerified: true,
      preferences: {
        language: "he",
        currency: "ILS",
        notifications: {
          email: true,
          sms: false,
          push: false,
        },
        marketing: false,
      },
    });

    await adminUser.save();

    console.log(chalk.green("✅ Admin user created successfully!"));
    console.log(chalk.blue(`📧 Email: ${email}`));
    console.log(chalk.blue(`🔑 Role: admin`));
  } catch (error) {
    console.error(chalk.red("❌ Error creating admin user:"), error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

// Run the deployment setup
setupAdminForDeployment();
