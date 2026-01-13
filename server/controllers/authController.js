const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER (Updated to Auto-Login)
const register = async (req, res, next) => {
  try {
    const { name, email, password, isSeller } = req.body; // Added isSeller support if needed

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isSeller: isSeller || false,
    });

    const savedUser = await newUser.save();

    // --- AUTO-LOGIN LOGIC START ---
    // Generate Token immediately so they don't have to login again
    const token = jwt.sign(
      { id: savedUser._id, isSeller: savedUser.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: userPassword, ...otherDetails } = savedUser._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,       // CRITICAL for Render/Vercel
        sameSite: "none",   // CRITICAL for Cross-Origin
      })
      .status(201)
      .json(otherDetails);
    // --- AUTO-LOGIN LOGIC END ---

  } catch (err) {
    next(err);
  }
};

// 2. LOGIN (Fixed variable names & Cookie Security)
const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json("Wrong password!");

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Extract password to not send it back
    const { password, ...otherDetails } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,       // CRITICAL
        sameSite: "none",   // CRITICAL
      })
      .status(200)
      .json(otherDetails); // Fixed: changed 'info' to 'otherDetails'

  } catch (err) {
    next(err);
  }
};

// 3. LOGOUT (Must also use secure/sameSite to delete correctly)
const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};

module.exports = { register, login, logout };