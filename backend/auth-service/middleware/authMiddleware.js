const jwt = require("jsonwebtoken"); // Import JWT library
const logger = require("../authLogs/logger"); // Import logger

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    logger.warn("No token provided"); // Log warning
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = { id: decoded.id, email: decoded.email }; // Attach user info
    logger.info("Token validated successfully"); // Log success
    next();
  } catch (error) {
    logger.error(`Token validation failed: ${error.message}`); // Log error
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
