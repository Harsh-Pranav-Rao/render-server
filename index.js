const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); 
const User = require('./models/user');
const router = require("./api");
const students = require("./routes/students")

var mongodbURL =  "mongodb+srv://harshpranavrao:vinayakpranav()9@robin-init.jsl7xly.mongodb.net/"

app.use(cors());
app.use(express.json()); //tells express what to do if the front end sends json data, without this express won't know how to handle it

// Connect Node and express to MongoDB
mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get("/",(req,res)=>{
    res.send("You're home");
})



app.post("/api/admin/listings", async (req, res) => {
    try {
      const {
        startupName,
        domain,
        verticalHiringIn,
        jobDescription,
        internshipDuration,
        internshipStipend,
      } = req.body;
      
      /*req.body looks like this:
        it's in json format, to handle this json format we use app.use(express.json());
       {
        "startupName": "Example Startup",
        "domain": "Tech",
        "verticalHiringIn": "Software Development",
        "jobDescription": "Front-end Developer",
        "internshipDuration": "3 months",
        "internshipStipend": "$1500 per month"
        }

        As you can see,  when we say = req.body, startupName = "Example startup" which is the value of the property "startupName", as both terms are one and the same,
        using object destructuring we can just write that as startupName. Then do this for all the vars. this only works because both the var and the field have the same name

       */
      const newListing = new Listing({
        startupName,
        domain,
        verticalHiringIn,
        jobDescription,
        internshipDuration,
        internshipStipend,
        usersApplied: [],
      });

      /* Similarly when we are creating a new instance of the model Listing, we want to give each field the value that the user entered
       this value is stored in the variables we created above. So instead of saying startupName : startupName using object destructuring we just say startupname
      */
  
      await newListing.save();
  
      res.status(201).json({ message: 'Listing created successfully' });
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { name, password } = req.body;
    console.log("name",name,"password",password)
    const existingUser = await User.findOne({ name });

    if (name === 'startup' && password === 'startup') {
      if (existingUser != null &&  existingUser.name == "startup") {
        // User with the entered name already exists
        return res.status(200).json({ message: 'User with this name already exists' });
      }
      // Create the admin user record
      const adminUser = new User({ type: 'admin', name });
      await adminUser.save();
  
      res.status(200).json({ role: 'admin' });
    } else if (name == 'student1' && password == 'student1') {
      console.log("hello1")
      if (existingUser != null && existingUser.name == "student1") {
        // User with the entered name already exists
        return res.status(200).json({ message: 'User with this name already exists' });
      }
      // Create the student user record
      const studentUser = new User({ type: 'student', name });
      await studentUser.save();
  
      res.status(200).json({ role: 'student' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post("/api/listings/:id/apply", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        console.log('Applying for listing ID:', id);
        console.log('Applying user name:', name);

        // Find the user by name in the users database
        const user = await User.findOne({ name });

        console.log('Found user:', user);

        // Find the listing by ID
        const listing = await Listing.findById(id);

        console.log('Found listing:', listing);

        // Add the user to the usersApplied array
        listing.usersApplied.push({ userId: user._id, name: user.name });
        console.log('listing array:', listing.usersApplied);

        // Save the updated listing
        await listing.save();

        console.log('Application submitted successfully');
        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add this route to your backend
app.get("/api/admin/applications", async (req, res) => {
  try {
      // Fetch all listings from the database
      const listings = await Listing.find();

      // Extract user IDs from all listings
      const userIds = listings.flatMap(listing => listing.usersApplied.map(user => user.userId));

      // Find unique user IDs
      const uniqueUserIds = [...new Set(userIds)];

      // Fetch user names based on user IDs
      const users = await User.find({ _id: { $in: uniqueUserIds } });

      // Create a map to quickly look up user names by ID
      const userIdToNameMap = new Map(users.map(user => [user._id.toString(), user.name]));

      // Extract and format user data from listings
      const applicationData = listings.flatMap(listing =>
          listing.usersApplied.map(user => ({ id: user.userId.toString(), name: userIdToNameMap.get(user.userId.toString()) }))
      );

      res.json(applicationData);
  } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.use("/api/students/listings",students)

app.listen(3000,()=>{
    console.log("running successfully")
})



