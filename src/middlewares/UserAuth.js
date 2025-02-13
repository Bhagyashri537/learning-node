const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; //  way to get token
    if (!token) {
      throw new Error("Token not found");
    }

    const decodeObj = jwt.verify(token, "DEV@Tinder$790");
   // console.log("Decoded Token:", decodeObj); // Debugging

    if (!decodeObj._id) {
      throw new Error("Invalid token payload");
    }

    const user = await User.findById(decodeObj._id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = { UserAuth };



