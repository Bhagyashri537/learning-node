const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {

  //creating new instance of an object
  const user = new User({
    firstName: "shree",
    lastName: "D",
    age: 25,
  });
  await user.save();
  res.send("we add user succesfully");
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
