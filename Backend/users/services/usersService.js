const { register } = require("../models/usersDataAccessService");
const { login } = require("../models/usersDataAccessService");
const { findOne } = require("../models/usersDataAccessService");
const { find } = require("../models/usersDataAccessService");
const { update } = require("../models/usersDataAccessService");
const { changeIsBizStatus } = require("../models/usersDataAccessService");
const { remove } = require("../models/usersDataAccessService");
const { validateSignup } = require("../validations/userValidationService");
const { validateLogin } = require("../validations/userValidationService");
const normalizeUser = require("../helpers/normalizeUser");
const { generateUserPassword } = require("../helpers/bcrypt");
const { OAuth2Client } = require("google-auth-library");
const { generateAuthToken } = require("../../auth/Providers/jwt");
const config = require("config");

// Get database configuration
const db = config.get("DB");
const User = require("../models/mongoDB/User");

exports.registerUser = async (rawUser) => {
  try {
    const { error } = validateSignup(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    let user = normalizeUser(rawUser);
    user.password = generateUserPassword(user.password);
    user = await register(user);

    const User = require("../models/mongoDB/User");
    const createdUser = await User.findById(user._id);
    return Promise.resolve(createdUser);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.loginUser = async (rawUser) => {
  try {
    const { error } = validateLogin(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    const user = await login(rawUser);
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.getUsers = async () => {
  try {
    const users = await find();
    return Promise.resolve(users);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.getUser = async (userID) => {
  try {
    const user = await findOne(userID); // Added 'const'
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.updateUser = async (userID, rawUser) => {
  try {
    let user = { ...rawUser };
    user = await update(userID, user);
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.changeUserBizStatus = async (userID) => {
  try {
    const user = await changeIsBizStatus(userID);
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
exports.deleteUser = async (userID) => {
  try {
    const user = await remove(userID); // Added 'const'
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};

// Google OAuth authentication
exports.processGoogleAuth = async (credential) => {
  try {
    const googleClientId = config.get("GOOGLE_CLIENT_ID");
    const client = new OAuth2Client(googleClientId);

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Parse the name - Google might send it in different formats
    const nameParts = (name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Check if user already exists by email
    let user;
    if (db === "MONGODB") {
      user = await User.findOne({ email });
    }
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;

      const newUser = {
        email,
        name: {
          first: firstName,
          last: lastName,
        },
        phone: "", // Will be empty, user can update later
        password: generateUserPassword(Math.random().toString(36)), // Generate random password
        address: {
          state: "",
          country: "",
          city: "",
          street: "",
          houseNumber: "",
          zip: "",
        },
        image: { url: picture || "", alt: name },
        role: "regular",
        isActive: true,
        googleId,
      };

      user = await register(newUser);
    } else {
      // Update existing user's name if it's empty
      if (db === "MONGODB" && (!user.name.first || !user.name.last)) {
        user.name.first = firstName;
        user.name.last = lastName;
        if (picture && !user.image?.url) {
          user.image = { url: picture, alt: name };
        }
        if (!user.googleId) {
          user.googleId = googleId;
        }
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone || "",
        role: user.role,
        image: user.image,
        googleId: user.googleId,
        favorites: user.favorites || [],
      },
      token,
      isNewUser,
    };
  } catch (err) {
    console.error("Google auth processing error:", err);
    return Promise.reject(new Error("Google authentication failed"));
  }
};
