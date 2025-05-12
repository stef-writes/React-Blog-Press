require("dotenv").config(); // Load environment variables from a .env file into process.env
const express = require("express"); // Import the Express.js framework for building the API Gateway
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const bodyParser = require("body-parser"); // Middleware to parse incoming JSON request bodies
const gatewayRoutes = require("./routes/gatewayRoutes"); // Import API Gateway routes
const logger = require("./gatewayLogger/logger"); // Import the custom logger middleware to log requests and responses
const loggerMiddleware = require("./gatewayLogger/logger").middleware;


// Initialize the Express.js application
const app = express();

// Set the port from environment variables, or use 5000 as a default
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: true, credentials: true })); // Enable CORS for frontend origin
app.use(bodyParser.json());
app.use(loggerMiddleware); // Attach HTTP logging middleware

// Routes
app.use("/api", gatewayRoutes);

// Start the server
app.listen(PORT, () => {
  logger.info({ message: `API Gateway is running on port ${PORT}` });
  console.log(`API Gateway is running on port ${PORT}`);
});
