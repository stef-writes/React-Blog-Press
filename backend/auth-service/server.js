require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express for building the HTTP server
const mongoose = require("mongoose"); // Import Mongoose for database interaction
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const authRoutes = require("./routes/authRoutes"); // Routes for handling authentication endpoints
const logger = require("./authLogs/logger"); // Pino logger for logging requests and errors
const pinoHttp = require("pino-http"); // Pino HTTP middleware for logging HTTP requests

const app = express(); // Initialize the Express application
const PORT = process.env.PORT || 5001; // Use PORT from environment variables or default to 5001

// Middleware setup
app.use(cors()); // Allow requests from other origins
app.use(bodyParser.json()); // Parse incoming JSON request bodies
app.use(pinoHttp({ logger })); // Attach Pino logger middleware for logging HTTP requests

// Mount routes
app.use("/auth", authRoutes); // Changed to mount directly on /auth to match gateway routing

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Auth Service connected to MongoDB");
    logger.info("Auth Service connected to MongoDB"); // Log MongoDB connection success
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    logger.error(`Database connection error: ${err.message}`); // Log error message
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
  logger.info(`Auth Service running on port ${PORT}`); // Log that the service is running
});
