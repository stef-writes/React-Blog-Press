require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./blogLogs/logger");

// Import Routes
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5002;

// Enable Cross-Origin Resource Sharing (CORS) for the entire application.
app.use(cors());

app.use(bodyParser.json());

// Custom middleware to log incoming requests. This middleware function will be executed for every incoming request.  Middleware functions have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.  The next function, when invoked, executes the middleware succeeding the current middleware.
app.use((req, res, next) => {
  // Log the HTTP method and the requested URL. This is a common practice for logging and monitoring incoming requests  `${}` is a template literal and allows you to embed expressions directly into strings
  logger.info(`${req.method} ${req.originalUrl} - Request received`);
  // Call `next()` to pass control to the next middleware function in the chain. If you don't call `next()`, the request will hang.
  next();
});

// Routes
app.use("/api/posts", postRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Blog Service connected to MongoDB");
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    logger.error(`MongoDB connection error: ${err.message}`);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Blog Service running on port ${PORT}`);
  logger.info(`Blog Service running on port ${PORT}`);
});
