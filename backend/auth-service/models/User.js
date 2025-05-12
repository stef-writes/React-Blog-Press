const mongoose = require("mongoose"); // Import Mongoose for database schema
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing passwords

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name is required
    email: { type: String, required: true, unique: true }, // Email must be unique
    password: { type: String, required: true }, // Password is required
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password hasn't changed
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt factor of 10
  next(); // Continue to the next middleware
});

// Instance method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered and stored passwords
};

// Export the model
module.exports = mongoose.model("User", userSchema);
