const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Unique category name
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts associated with this category
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Middleware to clean up associated posts when a category is deleted
categorySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const categoryId = this._id;

  // Remove the category reference from all associated posts
  await mongoose.model("Post").updateMany(
    { categories: categoryId },
    { $pull: { categories: categoryId } }
  );

  next();
});

module.exports = mongoose.model("Category", categorySchema);
