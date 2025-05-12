const logger = require("../blogLogs/logger"); // Import Pino logger
const { verifyToken, decodeToken } = require("../utils/jwtUtil"); // Import JWT utilities

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Extract the Authorization header
    const token = authHeader?.split(" ")[1]; // Extract the token from the header

    if (!token) {
      logger.warn("No token provided in Authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    console.log(token)
    // Verify the JWT using the utility
    const decoded = verifyToken(token);

    // Attach user details from the decoded token to the request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    logger.info({
      message: "User authenticated successfully",
      userId: req.user.id,
      email: req.user.email,
    });

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    if (error.name === "TokenExpiredError") {
      logger.warn("Token expired");
      return res.status(401).json({ message: "Token expired, please log in again" });
    }

    if (error.name === "JsonWebTokenError") {
      logger.error("Invalid token provided");
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    // Log any unexpected errors
    logger.error(`Token verification failed: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Extract the Authorization header
    const token = authHeader?.split(" ")[1]; // Extract the token from the header

    if (!token) {
      logger.info("No token provided, proceeding without authentication");
      return next(); // Skip authentication and proceed
    }

    // Decode token without verification (useful for optional routes)
    const decoded = decodeToken(token);
    if (decoded) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      logger.info({
        message: "Optional authentication successful",
        userId: req.user.id,
        email: req.user.email,
      });
    }
    next();
  } catch (error) {
    logger.warn(`Optional token decoding failed: ${error.message}`);
    next(); // Proceed without authentication
  }
};
