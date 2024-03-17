const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// for forgot password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique token for password reset
    const resetToken = jwt.sign({ userId: user._id }, "mysecret", {
      expiresIn: "1 hour",
    });
    

    console.log("Reset token:", resetToken);
    res.json({ resetToken, userId: user._id });

    // res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    next(error);
  }
};

//   for RESET PASSWORD
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, "mysecret");

    // Check if token has expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Find user by user ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's password in the database
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
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
  resetPassword,
  forgotPassword,
};
