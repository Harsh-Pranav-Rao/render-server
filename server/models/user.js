// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['admin', 'student'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
