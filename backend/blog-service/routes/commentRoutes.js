const express = require("express");
const {
  getComments,
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/commentsController");
const { protect } = require("../middleware/authMiddleware");
const logger = require("../blogLogs/logger");

const router = express.Router({ mergeParams: true });

// Logging middleware
router.use((req, res, next) => {
  logger.info(`Comment Route Request: ${req.method} ${req.originalUrl}`);
  next();
});

// GET comments for a post
router.get("/", protect, getComments);

// POST add a comment to a post
router.post("/", protect, addComment);

// PUT update a comment
router.put("/:commentId", protect, editComment);

// DELETE a comment
router.delete("/:commentId", protect, deleteComment);

module.exports = router;