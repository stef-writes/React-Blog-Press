// Import the necessary Mongoose models for tags, categories, and posts.
const Tag = require("../models/Tags");
const Category = require("../models/Category");
const Post = require("../models/Posts");
// Import the logger instance for logging events.
const logger = require("../blogLogs/logger");

// Define an asynchronous function to clean up unused tags.  This function will find tags that are not used in any posts and delete them.  This helps keep the database clean and prevent unused data from accumulating
const cleanUpTags = async () => {
  try {
    // Find all tags in the database.  This retrieves all documents from the Tag collection
    const tags = await Tag.find();
    // Iterate over each tag found.
    for (const tag of tags) {
      // Count the number of posts that use the current tag. Post.countDocuments counts the number of documents in the Post collection that match a given query
      const postCount = await Post.countDocuments({ tags: tag._id });
      // If no posts use the tag (postCount is 0)
      if (postCount === 0) {
        // Delete the tag from the database. findByIdAndDelete finds a document by its ID and deletes it
        await Tag.findByIdAndDelete(tag._id);
        // Log a message indicating that the unused tag was deleted
        logger.info(`Deleted unused tag: ${tag.name}`);
      }
    }
    // Catch any errors that may occur during the process.  This is important to prevent the application from crashing
  } catch (error) {
    // Log an error message if an error occurs.  Include the error message to provide more context
    logger.error(`Error cleaning up tags: ${error.message}`);
  }
};

// Define an asynchronous function to clean up unused categories. This function is very similar to `cleanUpTags`, but it operates on categories instead of tags.
const cleanUpCategories = async () => {
  try {
    // Find all categories in the database
    const categories = await Category.find();
    // Iterate over each category
    for (const category of categories) {
      // Count how many posts are associated with the current category
      const postCount = await Post.countDocuments({ categories: category._id });
      //If the category is not used in any post, delete it
      if (postCount === 0) {
        await Category.findByIdAndDelete(category._id);
        // Log a message that the unused category was deleted.
        logger.info(`Deleted unused category: ${category.name}`);
      }
    }
  } catch (error) {
    // Log an error message if any errors occur during the cleanup process.  Include the error message to help with debugging
    logger.error(`Error cleaning up categories: ${error.message}`);
  }
};

// Export the cleanup functions to make them available for use in other parts of the application.  This allows other modules to import and use these functions. For example, you might call these functions periodically to clean up the database
module.exports = {
  cleanUpTags,
  cleanUpCategories,
};
