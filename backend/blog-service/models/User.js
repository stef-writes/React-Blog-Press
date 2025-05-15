const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true, // While unique in auth-service, blog-service doesn't enforce it, just uses it.
  },
  // No password or methods needed here for blog-service's purposes
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);