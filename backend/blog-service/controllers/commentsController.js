const Comment = require("../models/Comments");
const Post = require("../models/Posts");
const logger = require("../blogLogs/logger");

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("author")
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    logger.error(`Error fetching comments for post ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Create the comment
    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId
    });
    
    await comment.save();
    
    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();
    
    // Return the saved comment with proper population
    const savedComment = await Comment.findById(comment._id)
      .populate("author");
    
    res.status(201).json(savedComment);
  } catch (error) {
    logger.error(`Error adding comment to post ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// Edit a comment
exports.editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }
    
    comment.content = content;
    await comment.save();
    
    const updatedComment = await Comment.findById(commentId)
      .populate("author");
    
    res.json(updatedComment);
  } catch (error) {
    logger.error(`Error editing comment ${req.params.commentId}: ${error.message}`);
    res.status(500).json({ message: "Failed to edit comment", error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    
    await comment.deleteOne();
    
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting comment ${req.params.commentId}: ${error.message}`);
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};
          