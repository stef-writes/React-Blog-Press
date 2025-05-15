// Import required models
const Like = require("../models/Like");
const Post = require("../models/Posts");
const logger = require("../blogLogs/logger");

// Add a like to a post
exports.addLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if the like already exists
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // Create a new like
    const like = new Like({ post: postId, user: userId });
    await like.save();

    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    logger.error(`Error adding like: ${error.message}`);
    res.status(500).json({ message: "Failed to add like", error: error.message });
  }
};

// Remove a like from a post
exports.removeLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find and delete the like
    const like = await Like.findOneAndDelete({ post: postId, user: userId });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.json({ message: "Like removed successfully" });
  } catch (error) {
    logger.error(`Error removing like: ${error.message}`);
    res.status(500).json({ message: "Failed to remove like", error: error.message });
  }
};

// Get all likes for a post
exports.getLikesByPost = async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.id }).populate("user");
    res.json(likes);
  } catch (error) {
    logger.error(`Error fetching likes: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch likes", error: error.message });
  }
};
