const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User has been created.");
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json("Wrong password!");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const { password, ...otherDetails } = user._doc;

    res.cookie("accessToken", token, { httpOnly: true })
       .status(200)
       .json({ message: "Login successful", user: otherDetails });
  } catch (err) { next(err); }
};

const logout = (req, res) => {
  res.clearCookie("accessToken", { sameSite: "none", secure: true })
     .status(200).json("User has been logged out.");
};

module.exports = { register, login, logout };