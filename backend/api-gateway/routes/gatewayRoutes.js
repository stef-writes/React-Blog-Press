// Import necessary modules.
const express = require("express"); // Import the Express.js framework for creating and managing the API.
const axios = require("axios"); // Import Axios for making HTTP requests to other services.
const { protect } = require("../middleware/authMiddleware"); // Import the 'protect' middleware for authentication.
const logger = require("../gatewayLogger/logger"); // Import the logger instance.

// Create an Express Router instance.  Routers are responsible for handling requests to a specific set of routes.  It can be thought of as a mini-application that can be mounted on a specific path within a larger Express application.
const router = express.Router();

// Load environment variables for service URLs.  Environment variables are values that are set outside of the application's code, often used for configuration.
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL; // URL of the authentication service.
const BLOG_SERVICE_URL = process.env.BLOG_SERVICE_URL; // URL of the blog service.

// Define a route for handling POST requests to /auth/register.
router.post("/auth/register", async (req, res) => {
  // Use a try...catch block to handle potential errors during the request.
  try {
    // Forward the POST request to the Auth Service using Axios.
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/register`, // Construct the full URL for the Auth Service endpoint.  Template literals are used for string interpolation `${}`
      req.body, // Pass the request body data to the Auth Service.
      {
        headers: { "Content-Type": "application/json" }, // Set the Content-Type header to indicate JSON data.
      }
    );

    //if the request is successful

    // Send the response from the Auth Service back to the client.  This includes the status code and the data from the response
    res.status(response.status).json(response.data);
  } catch (error) {
    //if the request fails for any reason
    // Check if the error object has a response property (indicating an error from the Auth Service).
    if (error.response) {
      // If the error is from the Auth Service, forward the original error status and data to the client.
      return res.status(error.response.status).json(error.response.data);
    }

    // If the error is not from the Auth Service (e.g., network error), handle it as a generic internal server error.  This is to prevent leaking sensitive information about internal errors to the client
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message, // Include the error message for debugging purposes (consider removing in production).
    });
  }
});

// Route to forward /auth/login requests to auth-service
router.post("/auth/login", async (req, res) => {
  try {
    // Forward the POST request to the Auth Service using Axios
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/login`, // URL for the Auth Service login endpoint
      req.body, // Pass the request body data (username/email and password)
      { headers: { "Content-Type": "application/json" } } // Set Content-Type header
    );
    // Send the response from the Auth Service back to the client
    res.status(response.status).json(response.data); // This will include the JWT if successful
  } catch (error) {
    // Log the error for debugging purposes
    logger.error({ error: error.message }, "Error during login request"); //Structured logging.  In this case, an object is logged.
    // Respond with an error message, using optional chaining (?.) to handle cases where error.response might be undefined
    res.status(error.response?.status || 500).json({
      message: "Error forwarding request to Auth Service",
      error: error.message, // Include the error message (consider removing in production)
    });
  }
});

// Route to forward /auth/logout requests to auth-service.  protect middleware is used to verify the use is logged in before they can log out.
router.post("/auth/logout", protect, async (req, res) => {
  try {
    // Forward the POST request to the Auth Service for logout
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/logout`, // Logout endpoint URL
      {}, // Empty request body as logout typically doesn't require data
      // We are passing the authorization header from the original request to the Auth Service. This header likely contains the JWT required for logout verification.
      { headers: { Authorization: req.headers.authorization } }
    );
    // Send the response from the Auth Service back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error that occurred during the logout request
    logger.error({ error: error.message }, "Error during logout request");
    // Respond with an error, using optional chaining to check for `error.response`
    res.status(error.response?.status || 500).json({
      message: "Error forwarding request to Auth Service",
      error: error.message, // Include the detailed error message
    });
  }
});

// Blog-Service Routes

// Forward requests for blog posts
router.use("/posts", protect, async (req, res) => {
  // Use protect middleware to ensure only authenticated users can access
  //destructure the request object
  const { method, body, headers, originalUrl } = req;
  console.log("Body:", body);
  // Construct the full URL to forward the request to the Blog Service
  const url = `${BLOG_SERVICE_URL}${originalUrl}`; // Forward to Blog Service
  try {
    // Log the request being forwarded
    logger.info(`Forwarding ${method} request to Blog Service: ${url}`);
    const response = await axios({
      method, // HTTP method (GET, POST, PUT, DELETE, etc.)
      url, // Constructed URL for the Blog Service
      data: body, // Request body data
      headers: { Authorization: headers.authorization }, // Forward the Authorization header for authentication
    });
    // Send the Blog Service's response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Log and handle errors during forwarding
    // console.log(error);
    logger.error(
      `Error forwarding ${method} request to Blog Service: ${url}`,
      error.message
    );
    res.status(error.response?.status || 500).json({
      // Use optional chaining for error status
      message: "Error forwarding request to Blog Service",
      error: error.message,
    });
  }
});

// TODO
// Implement /comments route to handle comment functionality

// TODO
// Implement /likes route to handle comment functionality



// Fallback route for any unmatched requests. This route will handle any request that doesn't match any of the defined routes above.  This acts like a 404 error handler
router.all("*", (req, res) => {
  logger.error(`Unhandled route: ${req.method} ${req.originalUrl}`); // Log the unhandled route
  res.status(404).json({ message: "Route not found" }); // Send a 404 Not Found response
});

module.exports = router;
