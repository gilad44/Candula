const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    first: { type: String, default: "" },
    last: { type: String, default: "" },
  },
  favorites: { type: [String], default: [] },
  addresses: { type: Array, default: [] },
  orders: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  preferences: {
    language: { type: String, default: "he" },
    currency: { type: String, default: "ILS" },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    marketing: { type: Boolean, default: false },
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
  googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
