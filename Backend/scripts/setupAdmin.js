const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../users/models/mongoDB/User");
const config = require("config");
const chalk = require("chalk");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Function to prompt for password (hidden input)
const promptPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";
    process.stdin.on("data", function (char) {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003":
          process.exit();
        default:
          process.stdout.write("*");
          password += char;
          break;
      }
    });
  });
};

async function setupAdmin() {
  try {
    console.log(chalk.blue("\n🔧 Admin Setup Wizard\n"));

    // Connect to database
    const dbURI = "mongodb://localhost:27017/Candula";
    await mongoose.connect(dbURI);
    console.log(chalk.green("✅ Connected to database"));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(chalk.yellow("⚠️  Admin user already exists!"));
      const overwrite = await prompt(
        "Do you want to create another admin? (y/N): "
      );
      if (overwrite.toLowerCase() !== "y") {
        console.log(chalk.blue("Setup cancelled."));
        process.exit(0);
      }
    }

    // Get admin details from environment variables or prompt
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;

    if (!email) {
      email = await prompt("Enter admin email: ");
    }

    if (!password) {
      password = await promptPassword("Enter admin password: ");
      const confirmPassword = await promptPassword("Confirm admin password: ");

      if (password !== confirmPassword) {
        console.log(chalk.red("❌ Passwords don't match!"));
        process.exit(1);
      }
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

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(chalk.red("❌ User with this email already exists!"));
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
        language: "en",
        currency: "USD",
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
    console.log(
      chalk.yellow(
        "\n⚠️  Please store these credentials securely and delete them from any temporary files."
      )
    );
  } catch (error) {
    console.error(chalk.red("❌ Error creating admin user:"), error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

// Handle script termination
process.on("SIGINT", () => {
  console.log(chalk.yellow("\nSetup cancelled by user."));
  rl.close();
  mongoose.connection.close();
  process.exit(0);
});

// Run the setup
setupAdmin();
