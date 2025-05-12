const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true }, // User who liked the post
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Associated post
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// No additional middleware is required for likes since they are handled directly via post cleanup.

module.exports = mongoose.model("Like", likeSchema);
