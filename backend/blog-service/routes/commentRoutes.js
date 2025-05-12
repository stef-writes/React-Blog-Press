// TODO
// 1. Set Up the Router
      // Objective: Create an Express router to handle comment-related operations.
      // Steps:
          // Import the express module.
          // Use express.Router() to create a new router instance.

// 2. Import Required Modules
      // Objective: Ensure necessary dependencies are available.
      // Steps:
          // Import the controller functions (getComments, addComment, editComment, deleteComment) from the commentsController file.
          // Import the protect middleware for authentication.
          // Import a logger instance for request logging.

// 3. Add Middleware for Logging
      // Objective: Log incoming requests for better traceability.
      // Steps:
          // Use router.use() to define a middleware that logs the request method and URL.
          // Call logger.info() with a formatted log message (e.g., GET /api/posts/:id/comments - Request received).
          // Call next() to pass control to the next middleware or route handler.

// 4. Define Routes
      // Objective: Handle CRUD operations for comments.
      // Steps:
          // Fetch Comments (GET /:id):
          // Use router.get() to define a route for fetching comments by post ID.
          // Apply the protect middleware to ensure only authenticated users can access this route.
          // Pass the getComments controller function as the route handler.
          // Add a Comment (POST /:id):
          // Use router.post() to define a route for adding a comment to a post.
          // Apply the protect middleware.
          // Pass the addComment controller function as the route handler.
          // Edit a Comment (PUT /:id):
          // Use router.put() to define a route for editing an existing comment by its ID.
          // Apply the protect middleware.
          // Pass the editComment controller function as the route handler.
          // Delete a Comment (DELETE /:id):
          // Use router.delete() to define a route for deleting a comment by its ID.
          // Apply the protect middleware.
          // Pass the deleteComment controller function as the route handler.

// 5. Export the Router
      // Objective: Make the router available to the application.
      // Steps:
          // Use module.exports to export the router instance.
          // Ensure the router is imported and mounted in the main application file (e.g., app.js).