// Import the 'jsonwebtoken' library, which provides functions for creating and verifying JSON Web Tokens (JWTs).
const jwt = require("jsonwebtoken");

// Export a function called 'generateToken' that takes a user object as input.  This function will be used to create a JWT for a given user, typically after successful authentication
exports.generateToken = (user) => {
  // Use the 'jwt.sign' method to generate a JWT.
    // The first argument is the payload that would be encoded into the JWT. In this case it includes the user's ID and email.  You can include any data you want as long as it doesn't contain sensitive information
    // The second argument is the secret key that is used to sign the token. This key should be kept secure and should not be shared publicly. process.env.JWT_SECRET retrieves the JWT secret key from environment variables
    // The third argument is an options object. Here, it specifies that the token will expire in 1 day ('1d')
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
    //jwt.sign returns a string which is the JWT.  This token can then be sent to the client, typically in the Authorization header, and used for subsequent requests to authenticate the user.
};