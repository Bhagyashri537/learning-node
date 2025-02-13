// const express = require("express");
// const authRouter = express.Router();

// const { validateSignUpData } = require("../utils/validation");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");

// authRouter.post("/signup", async (req, res) => {
//   try {
//     // Validation of data
//     validateSignUpData(req);

//     const { firstName, lastName, emailId, password } = req.body;

//     // Encrypt the password
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     //   Creating a new instance of the User model
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });

//     await user.save();
//     res.send("User Added successfully!");
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

// authRouter.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     const user = await User.findOne({ emailId: emailId });
//     if (!user) {
//       throw new Error("Invalid credentials");
//     }
//     const isPasswordValid = await user.validatePassword(password);

//     if (isPasswordValid) {
//       const token = await user.getJWT();

//       res.cookie("token", token, {
//         expires: new Date(Date.now() + 8 * 3600000),
//       });
//       res.send("Login Successful!!!");
//     } else {
//       throw new Error("Invalid credentials");
//     }
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

// module.exports = authRouter;

























const express = require("express");
const { ValidateSignUpData } = require("../Utils/Validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT(); // Use getJWT()

    res.cookie("token", token, { httpOnly: true });
    res.send("Login Successful!!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("logout succesful")
})

  

module.exports = authRouter;






