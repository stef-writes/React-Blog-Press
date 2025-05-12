const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Post title
    content: { type: String, required: true }, // Post content
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // Associated tags
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Associated categories
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }], // Associated likes
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Associated comments
    author: { type: mongoose.Schema.Types.ObjectId, required: true } // Only store userId
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Middleware to clean up associated data when a post is deleted
postSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const postId = this._id;

  // Delete all likes associated with the post
  await mongoose.model("Like").deleteMany({ post: postId });

  // Delete all comments associated with the post
  await mongoose.model("Comment").deleteMany({ post: postId });

  // Remove post references from tags
  await mongoose.model("Tag").updateMany(
    { _id: { $in: this.tags } },
    { $pull: { posts: postId } }
  );

  // Remove post references from categories
  await mongoose.model("Category").updateMany(
    { _id: { $in: this.categories } },
    { $pull: { posts: postId } }
  );

  next();
});

module.exports = mongoose.model("Post", postSchema);
