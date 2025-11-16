const lodash = require("lodash");
const User = require("./mongoDB/User");
const { handleBadRequest } = require("../../utils/errorHandler");
const { comparePassword } = require("../helpers/bcrypt");
const { generateAuthToken } = require("../../auth/Providers/jwt");
const config = require("config");
const db = config.get("DB");

exports.register = async (normalizedUser) => {
  if (db === "MONGODB") {
    try {
      const { email } = normalizedUser.email;
      let user = await User.findOne({ email });
      if (user) {
        throw new Error("User already registered");
      }
      user = new User(normalizedUser);
      user = await user.save();
      user = lodash.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User created not in mongodb");
};
exports.login = async (normalizedUser) => {
  if (db === "MONGODB") {
    try {
      const { email, password } = normalizedUser;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Authentication Error: Invalid email");
      }
      const validPassword = comparePassword(password, user.password);
      if (!validPassword) {
        throw new Error("Authentication Error: Invalid password");
      }

      const token = generateAuthToken(user);

      // Return both token and user data (excluding password)
      const userResponse = lodash.pick(user, [
        "_id",
        "name",
        "email",
        "role",
        "phone",
        "addresses",
        "favorites",
        "orders",
        "isEmailVerified",
        "preferences",
        "createdAt",
        "updatedAt",
      ]);

      return Promise.resolve({
        token,
        user: {
          ...userResponse,
          id: userResponse._id, // Add id field for frontend compatibility
        },
      });
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User created not in mongodb");
};

exports.find = async () => {
  if (db === "MONGODB") {
    try {
      const users = await User.find().select("-password -__v");
      return Promise.resolve(users);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};
exports.findOne = async (userID) => {
  if (db === "MONGODB") {
    try {
      const user = await User.findById(userID).select("-password -__v");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};
exports.update = async (userID, normalizedUser) => {
  if (db === "MONGODB") {
    try {
      const user = await User.findByIdAndUpdate(userID, normalizedUser, {
        new: true,
      }).select("-password -__v");
      if (!user) {
        throw new Error("Can't update user as it's not found in mongodb");
      } else {
        return Promise.resolve(user);
      }
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User not in db");
};
exports.changeIsBizStatus = async (userID) => {
  if (db === "MONGODB") {
    try {
      return `user no. ${userID} - is business`;
    } catch (error) {
      error.status = 404;
      return Promise.reject(error);
    }
  }
};
exports.remove = async (userID) => {
  if (db === "MONGODB") {
    try {
      const user = await User.findByIdAndDelete(userID).select(
        "-password -__v"
      );
      if (!user) {
        throw new Error("Couldn't delete user as it's not in the db");
      } else {
        return Promise.resolve(user);
      }
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User not in db");
};
