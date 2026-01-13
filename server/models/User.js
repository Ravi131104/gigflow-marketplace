const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    // REGEX: Forces standard email format (text@domain.com)
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"], // Edge Case: Weak passwords
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);