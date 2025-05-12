// Import the 'jsonwebtoken' library for working with JWTs.
const jwt = require("jsonwebtoken");
// Import the logger instance for logging events.
const logger = require("../blogLogs/logger");

// Function to verify a JWT. This function takes a JWT as input and verifies its signature and expiry date.
const verifyToken = (token) => {
  // Log the token being verified (useful for debugging).
  console.log(token);
  // Use a try...catch block to handle potential errors during verification.
  try {
    // Verify the token using the JWT secret. jwt.verify throws an error if the token is invalid or expired.  process.env.JWT_SECRET reads the secret from environment variables.  The decoded JWT payload will be returned if successful
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Log a success message along with user ID and email from the decoded token.  This is an example of structured logging
    logger.info({
      message: "Token verification successful",
      userId: decoded.id,
      email: decoded.email,
    });
    // Return the decoded payload containing user information.
    return decoded;
  } catch (error) {
    // Log an error message if verification fails.  This could happen if the token is invalid, expired or the secret is incorrect
    logger.error(`Token verification failed: ${error.message}`);
    // Throw a new error indicating that the token is invalid.  This will propagate the error up to where the function is called
    throw new Error("Invalid token");
  }
};

// Function to decode a JWT without verifying it. This is useful when you only need to extract information from the token without checking its validity (e.g., in a public route where authentication is not required but user info might be helpful).
const decodeToken = (token) => {
  // Use a try...catch block to handle potential decoding errors.  jwt.decode can fail if the token is malformed
  try {
    // Decode the token without verification using jwt.decode. This doesn't check the signature or expiry.  It simply decodes the token
    const decoded = jwt.decode(token);
    // Log the decoded payload.  This is useful for debugging or auditing purposes.
    logger.info({
      message: "Token decoded successfully",
      payload: decoded,
    });
    // Return the decoded payload.
    return decoded;
  } catch (error) {
    // Log an error message if decoding fails.
    logger.error(`Token decoding failed: ${error.message}`);
    // Throw an error indicating that the token decoding failed.
    throw new Error("Failed to decode token");
  }
};

// Export the functions to make them available for use in other modules.
module.exports = {
  verifyToken,
  decodeToken,
};
