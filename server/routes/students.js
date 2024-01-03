// const students = require("express").Router();
const Listing = require('../models/listing'); 

const students = async (req, res) => {
    try {
        // Fetch all listings from the database
        console.log("hell student")
        const listings = await Listing.find();
  
        // Send the listings as JSON response
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
  };




module.exports = students;




