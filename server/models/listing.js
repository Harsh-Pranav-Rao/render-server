// models/listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  startupName: String,
  domain: String,
  verticalHiringIn: String,
  jobDescription: String,
  internshipDuration: String,
  internshipStipend: String,
  usersApplied: [
    {
      // Define properties for each user in the array
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
      },
      // Add more properties as needed
    },
  ],
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
