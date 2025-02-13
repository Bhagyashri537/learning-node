const express = require("express");
const request = express.Router();
const { UserAuth } = require("../middlewares/UserAuth");


//sending connection request
request.post("/sendconnectionreq", UserAuth, async(req, res) => {
    const user = req.user
  
    console.log("sendfing conncetion")
    res.send(user.firstName + "send a connection req send")
  })

  module.exports = request;