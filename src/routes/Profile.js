const express = require("express");
const profile = express.Router();

const { UserAuth } = require("../middlewares/UserAuth");


//update profile
profile.get("/profile", UserAuth, async (req, res) => {
    try {
      const user = req.user; // User is set by the middleware
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });
  

  module.exports = profile;


  