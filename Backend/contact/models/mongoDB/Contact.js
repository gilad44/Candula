const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    match: RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  },
  subject: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  message: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  status: {
    type: String,
    enum: ["חדש", "נקרא", "נענה", "טופל"],
    default: "חדש",
  },
  priority: {
    type: String,
    enum: ["נמוכה", "בינונית", "גבוהה", "דחופה"],
    default: "בינונית",
  },
  adminNotes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  responseBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  responseDate: {
    type: Date,
  },
});

// Update the updatedAt field before saving
ContactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
