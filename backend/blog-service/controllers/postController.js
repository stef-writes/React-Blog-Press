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

// Update an existing post
exports.updatePost = async (req, res) => {
  const { title, content, tags, categories } = req.body;
  const postId = req.params.id;

  try {
    logger.info("Received request to update post", { postId, title, tags, categories });

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      logger.warn("Post not found for update", { postId });
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user is the author
    if (post.author.toString() !== req.user.id) {
      logger.warn("Unauthorized update attempt", { postId, userId: req.user.id });
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Prepare updatedData object
    const updatedData = {};
    if (title) updatedData.title = title;
    if (content) updatedData.content = content;

    // Handle tags if provided
    if (tags && tags.length > 0) {
      const tagIds = await createOrGetTags(tags);
      updatedData.tags = tagIds;
      logger.info("Tags processed for update", { tagIds });
    }

    // Handle categories if provided
    if (categories && categories.length > 0) {
      const categoryIds = await createOrGetCategories(categories);
      updatedData.categories = categoryIds;
      logger.info("Categories processed for update", { categoryIds });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedData,
      { new: true, runValidators: true }
    ).populate("author tags categories");

    logger.info("Post updated successfully", { postId });
    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    logger.error(`Error occurred while updating post: ${error.message} ${error.stack}`);
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// Delete an existing post
exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id; // Assuming protect middleware sets req.user

  try {
    logger.info(`Attempting to delete post with ID: ${postId} by user ID: ${userId}`);

    // 1. Find post by ID
    const post = await Post.findById(postId);

    // 2. Check if post exists
    if (!post) {
      logger.warn(`Post not found for deletion. Post ID: ${postId}`);
      return res.status(404).json({ message: "Post not found" });
    }

    // 3. Verify user authorization
    if (post.author.toString() !== userId) {
      logger.warn(`Unauthorized delete attempt. Post ID: ${postId}, User ID: ${userId}, Author ID: ${post.author.toString()}`);
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // 4. Remove associated likes and comments
    logger.info(`Deleting likes for post ID: ${postId}`);
    await Like.deleteMany({ post: postId });
    logger.info(`Deleting comments for post ID: ${postId}`);
    await Comment.deleteMany({ post: postId });

    // 5. Delete the post itself
    await post.deleteOne(); // or await Post.findByIdAndDelete(postId);
    logger.info(`Post deleted successfully. Post ID: ${postId}`);

    await cleanUpTags();
    await cleanUpCategories();
    logger.info(`Tag and category cleanup process initiated after deleting post ID: ${postId}`);


    // 7. Respond with a success message
    res.status(200).json({ message: "Post and associated data deleted successfully" });

  } catch (error) {
    logger.error(`Error deleting post. Post ID: ${postId}, Error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
