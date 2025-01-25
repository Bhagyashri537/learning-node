const jwt = require("jsonwebtoken");

const User = require("../models/user");


const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token not found");
    }

    const decodeObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Pass user to the request object
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message); // Use status 401 for unauthorized access
  }
};

module.exports = {
  UserAuth,
};
