const User = require("../models/User"); // Import the User model
const { generateToken } = require("../utils/tokenUtils"); // Import JWT token generator

// Handle user registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, and password from request
  console.log("Register request body:", req.body); // Added log

  try {
    const existingUser = await User.findOne({ email }); // Check if the user already exists
    console.log("Existing user check result:", existingUser); // Added log
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // Return error if user exists
    }

    const user = new User({ name, email, password }); // Create a new user instance
    await user.save(); // Save the user to the database

    const token = generateToken(user); // Generate a JWT for the user

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name, email }, // Send user details in response
      token, // Include the token
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user", error: error.message }); // Return error
  }
};

// Handle user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Find the user by email
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" }); // Return error if invalid
    }

    const token = generateToken(user); // Generate a JWT for the user

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email }, // Send user details in response
      token, // Include the token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message }); // Return error
  }
};

// Handle user logout
// Logout Controller
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

