// likeRoutes.js - Contains routes for like-related operations

const express = require('express');
const { addLike, removeLike, getLikesByPost } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');
const logger = require('../blogLogs/logger');

const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - Request received`);
  next();
});

// Routes for like operations
router.post('/:id/like', protect, addLike);
router.delete('/:id/like', protect, removeLike);
router.get('/:id/likes', protect, getLikesByPost);

module.exports = router;
