const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  verifyToken:String,
  verified: Boolean,
  favourites: Array,
  bookings: Array,
});

module.exports = mongoose.model("User", userSchema);
