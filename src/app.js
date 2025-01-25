const express = require("express");
const connectDB = require("./config/database");
//const { User } = require("./models/user");
const { ValidateSignUpData } = require("./Utils/Validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("./middlewares/UserAuth");
const User = require("./models/user");


const app = express();

app.use(express.json());
app.use(cookieParser());

// Signup
app.post("/signup", async (req, res) => {
  try {
    ValidateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Debugging logs
    console.log("User model:", User);
    console.log("Request body:", req.body);

    // Check if email exists
    const user = await User.findOne({ emailId: emailId });
    console.log("User found:", user);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT()
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});


//update profile
app.get("/profile", UserAuth,  async (req, res) => {
  try {
      const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});


//sending connection request
app.post("/sendconnectionreq", UserAuth, async(req, res) => {
  const user = req.user

  console.log("sendfing conncetion")
  res.send(user.firstName + "send a connection req send")
})

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

//delete the user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User not found"); // Handle case where user is not found
    }
  } catch (err) {
    console.error("Error deleting user:", err.message); // Log error details
    res.status(400).send("Something went wrong");
  }
});

//update user data
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  runValidator: true;

  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("data updated sucessfully");
  } catch (err) {
    console.error("Error deleting user:", err.message); // Log error details
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("database connection is established");
    app.listen(3000, () => {
      console.log("sever is listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("database cannot be connceted");
  });
