const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  url: {
    type: String,
    match: RegExp(/^[a-zA-Z0-9\-_.() ]+$/),
  },
  alt: {
    type: String,
    min: Number,
  },
});
module.exports = imageSchema;
