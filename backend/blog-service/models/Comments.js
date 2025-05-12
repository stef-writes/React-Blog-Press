const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true }, // Comment text
    author: { type: mongoose.Schema.Types.ObjectId, required: true }, // User who wrote the comment
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Associated post
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Middleware to update the post's comments array when a comment is deleted
commentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const commentId = this._id;

  // Remove the comment reference from the associated post
  await mongoose.model("Post").updateOne(
    { comments: commentId },
    { $pull: { comments: commentId } }
  );

  next();
});

module.exports = mongoose.model("Comment", commentSchema);
