require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./blogLogs/logger");

// Import Routes
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();
const PORT = process.env.PORT || 5002;

// Enable Cross-Origin Resource Sharing (CORS) for the entire application.
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - Request received`);
  next();
});

// Routes
app.use("/api/posts", postRoutes);
// Mount comment routes directly instead of nesting
app.use("/api/posts/:id/comments", commentRoutes);
// Mount like routes
app.use("/api/likes", likeRoutes);

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

// Start the server only if this file is run directly
if (require.main === module) {
app.listen(PORT, () => {
    console.log(`Blog Service connected to MongoDB`);
  logger.info(`Blog Service running on port ${PORT}`);
});
}

module.exports = app; // Export the app for testing
