const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../users/models/mongoDB/User");
const chalk = require("chalk");

async function updateUserPasswords() {
  try {
    console.log(chalk.blue("🔄 Updating user passwords..."));

    // Connect to database
    const dbURI = "mongodb://localhost:27017/Candula";
    await mongoose.connect(dbURI);
    console.log(chalk.green("✅ Connected to database"));

    // Update regular user password
    const regularUser = await User.findOne({ email: "regular@gmail.com" });
    if (regularUser) {
      const newPassword = await bcrypt.hash("Regular123!", 10);
      regularUser.password = newPassword;
      await regularUser.save();
      console.log(chalk.green("✅ Updated regular user password"));
    }

    // Update business user password
    const businessUser = await User.findOne({ email: "business@gmail.com" });
    if (businessUser) {
      const newPassword = await bcrypt.hash("Business123!", 10);
      businessUser.password = newPassword;
      await businessUser.save();
      console.log(chalk.green("✅ Updated business user password"));
    }

    console.log(chalk.green("🎉 Password update complete!"));
  } catch (error) {
    console.error(chalk.red("❌ Error updating passwords:"), error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update
updateUserPasswords();
