const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Unique tag name
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts associated with this tag
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Middleware to clean up associated posts when a tag is deleted
tagSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const tagId = this._id;

  // Remove the tag reference from all associated posts
  await mongoose.model("Post").updateMany(
    { tags: tagId },
    { $pull: { tags: tagId } }
  );

  next();
});

module.exports = mongoose.model("Tag", tagSchema);
