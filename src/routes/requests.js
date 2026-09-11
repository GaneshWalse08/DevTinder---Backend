const express = require("express");

const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest", (req, res) => {
  res.send("Connection Request sent!!");
})

module.exports = requestRouter;