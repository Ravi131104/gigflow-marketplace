const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER
const register = async (req, res, next) => {
  try {
    const { name, email, password, isSeller } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isSeller: isSeller || false,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, isSeller: savedUser.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: userPassword, ...otherDetails } = savedUser._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(201)
      // CHANGE: Send token in body too
      .json({ ...otherDetails, token }); 

  } catch (err) {
    next(err);
  }
};

// 2. LOGIN
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

    const { password, ...otherDetails } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      // CHANGE: Send token in body too
      .json({ ...otherDetails, token });

  } catch (err) {
    next(err);
  }
};

// 3. LOGOUT
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