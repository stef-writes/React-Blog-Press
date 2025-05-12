// Import the 'jsonwebtoken' library for working with JSON Web Tokens (JWTs).
const jwt = require("jsonwebtoken");
// Import the custom logger instance.
const logger = require("../gatewayLogger/logger");

// Export a middleware function named 'protect'. Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
exports.protect = (req, res, next) => {
    // Log an informational message indicating that the 'protect' middleware has been triggered.
    logger.info("Protect middleware triggered");
    
    // Extract the 'Authorization' header from the incoming request. This header typically contains the JWT.
    const authHeader = req.headers.authorization;
    // Log the value of 'authHeader' to the console.  This is useful for debugging.
    console.log(authHeader, "Auth Headers are added here");

    // Check if the 'Authorization' header is missing or doesn't start with "Bearer ".
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Log a warning message if the header is missing or malformed.
        logger.warn("Missing or malformed Authorization header");
        // Return a 401 Unauthorized response with a JSON message indicating that no token was provided.
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Extract the JWT from the 'Authorization' header by splitting it at the space and taking the second element.
        //The split method is used to split a string into an array of substrings, and returns the new array.
        //If an empty string ("") is used as the separator, the string is split between each character.
    const token = authHeader.split(" ")[1];
    // Log the extracted token.
    logger.info(`Extracted token: ${token}`);

    // Use a try...catch block to handle potential errors during JWT verification.
    try {
        // Verify the JWT using the secret key stored in the 'JWT_SECRET' environment variable.  jwt.verify confirms that the signature is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Log the decoded token payload.  After the JWT is verified, the payload is returned,
        logger.info(`Token decoded successfully: ${JSON.stringify(decoded)}`);
        // Attach the decoded payload to the request object for use in subsequent middleware or route handlers.  This makes the user information available to subsequent parts of your application
        req.user = decoded;
        // Call the 'next' middleware function to continue processing the request.
        next();
    } catch (error) {
        // Log an error message if the token is invalid or if an error occurs during verification.
        logger.error(`Invalid token: ${error.message}`);
        // Return a 401 Unauthorized response if the token is invalid.
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};
