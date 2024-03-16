const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  signup,
  requestPasswordReset,
  resetPassword,
} = require("../services/auth.service");

const signUpController = async (req, res, next) => {
  const signupService = await signup(req.body);
  return res.json(signupService);
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

// Register a new user
const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // const user = new User({ username, email, password });
    const user = new User({ username, email, password });

    await user.save();
    res.json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
};
