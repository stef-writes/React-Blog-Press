// TODO
// 1. Set Up Dependencies
    // Objective: Ensure necessary modules and middleware are available.
    // Steps:
          // Import the express module to create a router.
          // Import the addLike, removeLike, and getLikesByPost functions from the likeController.
          // Import the protect middleware to ensure only authenticated users can interact with the routes.
          // Import the logger module for logging requests.

// 2. Create a Router
    // Objective: Use express.Router() to define and manage routes for likes.
    // Steps:
          // Initialize a router instance using express.Router().

// 3. Add Logging Middleware
    // Objective: Log incoming requests for debugging and monitoring.
    // Steps:
          // Use router.use() to add a middleware function that logs the HTTP method and URL of each request.
          // Use the logger.info method to log the message in a structured format.
          // Call next() to pass control to the next middleware or route handler.

// 4. Define the Routes
    // Objective: Implement routes for adding, removing, and fetching likes.
    // Steps:
          // Add Like:
              // Use router.post() to define a route for adding a like to a post.
              // Apply the protect middleware to ensure only authenticated users can add likes.
              // Attach the addLike function as the route handler.
          // Remove Like:
              // Use router.delete() to define a route for removing a like from a post.
              // Apply the protect middleware to ensure only authenticated users can remove likes.
              // Attach the removeLike function as the route handler.
          // Fetch Likes:
              // Use router.get() to define a route for fetching likes for a specific post.
              // Apply the protect middleware to ensure only authenticated users can view likes.
              // Attach the getLikesByPost function as the route handler.

// 5. Secure the Routes
    // Objective: Ensure only authorized users can access these routes.
    // Steps:
          // Use the protect middleware to validate the user's authentication token.
          // Ensure the middleware attaches user information (e.g., req.user) to the request object for further use in controllers.

// 6. Export the Router
    // Objective: Make the router available for integration with the main application.
    // Steps:
          // Use module.exports to export the router instance.
          // Import and mount this router in your main application file (e.g., app.js) under the desired base path.
