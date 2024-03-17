const express = require("express");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");



const app = express();
const PORT = process.env.PORT || 8000;

// Allow requests from localhost:3000
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use("/auth", authRoutes);

// Define user routes
app.use("/user", userRoutes);

// app.use("/forgotpassword", forgotPasswordRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
