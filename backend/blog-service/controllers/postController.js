const Post = require("../models/Posts");
const Tag = require("../models/Tags");
const Category = require("../models/Category");
const Comment = require("../models/Comments");
const Like = require("../models/Like");
const { cleanUpTags, cleanUpCategories } = require("../utils/cleanup");
const paginate = require("../utils/paginationUtil");
const logger = require("../blogLogs/logger"); // Import logger for logging request and response details

// Helper function to create or retrieve tags
const createOrGetTags = async (tags) => {
  const tagIds = [];
  for (const tagName of tags) {
    let tag = await Tag.findOne({ name: tagName });
    if (!tag) {
      // Create a new tag if it doesn't exist
      tag = new Tag({ name: tagName });
      await tag.save();
    }
    tagIds.push(tag._id);
  }
  return tagIds;
};

// Helper function to create or retrieve categories
const createOrGetCategories = async (categories) => {
  const categoryIds = [];
  for (const categoryName of categories) {
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      // Create a new category if it doesn't exist
      category = new Category({ name: categoryName });
      await category.save();
    }
    categoryIds.push(category._id);
  }
  return categoryIds;
};

// Fetch all posts with pagination
exports.getPosts = async (req, res) => {
  const { page = 1, results_per_page = 5 } = req.query;
  try {
    const posts = await Post.find()
      .skip((page - 1) * results_per_page)
      .limit(Number(results_per_page))
      .populate("author tags categories comments");
    const totalPosts = await Post.countDocuments();
    // Return posts, total pages, and current page
    res.json({ 
      posts, 
      totalPages: Math.ceil(totalPosts / results_per_page), 
      currentPage: Number(page) 
    });
  } catch (error) {
    console.error("Error fetching posts:", error); // Detailed error logging

    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// Fetch a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author tags categories comments");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Count likes for the post
    const likeCount = await Like.countDocuments({ post: post._id });
    res.json({ ...post.toObject(), likeCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, tags, categories } = req.body;

  try {
    logger.info("Received request to create a new post", { title, tags, categories });

    // Create or retrieve associated tags and categories
    const tagIds = await createOrGetTags(tags);
    logger.info("Tags processed successfully", { tagIds });

    const categoryIds = await createOrGetCategories(categories);
    logger.info("Categories processed successfully", { categoryIds });

    // Create and save the post
    const post = new Post({
      title,
      content,
      tags: tagIds,
      categories: categoryIds,
      author: req.user.id,
    });

    await post.save();
    logger.info("Post created successfully", { postId: post._id });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    logger.error(`Error occurred while creating a post: ${error.message} ${error.stack}`);
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// TODO
  // 1. Implement the updatePost Function
    // Objective: Allow authorized users to update a post.
    // Steps:
          // Retrieve the tags, categories, title, and content from req.body.
          // Use Post.findById(req.params.id) to find the post by ID from the database.
          // If the post is not found, return a 404 Not Found response with an appropriate message.
          // Check if the current user (req.user.id) matches the post’s author:
              // If they do not match, return a 403 Forbidden response with an appropriate message.
          // Prepare an updatedData object:
              // Add title and content to the object if provided.
          // If tags are provided:
              // Call createOrGetTags to retrieve or create the associated tag IDs.
              // Add the tag IDs to updatedData.
          // If categories are provided:
              // Call createOrGetCategories to retrieve or create the associated category IDs.
              // Add the category IDs to updatedData.
              // Use Post.findByIdAndUpdate to update the post with the updatedData object and return the updated post.
              // Respond with a success message and the updated post.
              // Use a try...catch block to handle errors and return a 500 Internal Server Error response in case of failures.
  // 2. Implement the deletePost Function
    // Objective: Allow authorized users to delete a post and its associated data.
    // Steps:
        // Use Post.findById(req.params.id) to find the post by ID from the database.
        // If the post is not found, return a 404 Not Found response with an appropriate message.
        // Check if the current user (req.user.id) matches the post’s author:
              // If they do not match, return a 403 Forbidden response with an appropriate message.
        // Remove associated likes and comments:
            // Use Like.deleteMany to delete all likes for the post.
            // Use Comment.deleteMany to delete all comments for the post.
        // Delete the post itself:
            // Use post.deleteOne() to remove the post from the database.
        // Clean up unused tags and categories:
            // Call cleanUpTags to remove tags that are no longer associated with any posts.
            // Call cleanUpCategories to remove categories that are no longer associated with any posts.
            // Respond with a success message indicating the post and its associated data were deleted successfully.
            // Use a try...catch block to handle errors and return a 500 Internal Server Error response in case of failures.
