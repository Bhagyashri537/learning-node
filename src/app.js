const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const user = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  //console.log(req.body)

  //creating new instance of an user model throgh postman

  const user = new User(req.body)

  try{
     await user.save()
     res.send("user added succesfully")
  }
  catch(err){
     res.status(400).send("error saving the user" + err.message)
  }

  
});

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
   const userId = req.body.userId
   const data = req.body;

   try{
     await User.findByIdAndUpdate({_id: userId}, data)
     res.send("data updated sucessfully")
   }
   catch (err) {
    console.error("Error deleting user:", err.message); // Log error details
    res.status(400).send("Something went wrong");
  }
})




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
