// server/models/User.js
require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['customer', 'chef'], required: true },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    specialties: String
  },
  googleId: String,
  githubId: String,
  facebookId: { type: String, sparse: true },
  deletionRequested: {
    type: Boolean,
    default: false
  },
  deletionRequestedAt: Date,
  deletionCompletedAt: Date
});

module.exports = mongoose.model('User', userSchema);