// Import the Express.js framework.  Used to create and manage API routes
const express = require("express");

// Import functions from the authController for handling registration, login, and logout logic.
const { register, login, logout } = require("../controllers/authController");

// Import the 'protect' middleware, which is used to protect routes that require authentication.
const { protect } = require("../middleware/authMiddleware");

// Import the logger instance for logging events.
const logger = require("../authLogs/logger");

// Create an Express Router.  A router allows you to define a set of routes that will be handled by a specific part of your application
const router = express.Router();

// Define public routes (no authentication required)

// Route for user registration. It handles POST requests to /register and calls the register function from the authController
router.post("/register", register);

// Route for user login. It handles POST requests to /login and calls the login function from the authController
router.post("/login", login);

// Define protected routes (authentication required using the 'protect' middleware)

// Route for user logout. It handles POST requests to /logout.  The protect middleware ensures that only authenticated users can access this route.
router.post("/logout", protect, (req, res) => {
  // Log that the logout route was accessed
  logger.info("Logout route hit");
  // Call the logout function from the authController to handle the logout logic.
  logout(req, res);
});

// Export the router so it can be used in other parts of the application. This allows you to mount the router on a specific path in your main application file and handle requests related to authentication at that path.
module.exports = router;
