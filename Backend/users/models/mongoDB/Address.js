const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
  city: {
    type: String,
    min: Number,
    required: Boolean,
  },
  street: {
    type: String,
    min: Number,
    required: Boolean,
  },
  houseNumber: {
    type: Number,
    required: Boolean,
  },
  zip: {
    type: Number,
    required: Boolean,
  },
});
module.exports = AddressSchema;
