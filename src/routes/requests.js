const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      // if(toUserId == fromUserId){
      //   res.status(400).send("You cant send the request to yourself!!");
      // }  or write pre function in Schema

      const checkTOUserId = await User.findById(toUserId);

      if (!checkTOUserId) {
        return res.status(400).send("user does not exists!");
      }

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status!!" + status);
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({
          message: "Connection request already exists!!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();

      if (status == "ignored") {
        res.json({
          message: "Profile Ignored Successfully!!",
        });
      } else {
        res.json({
          message: "Connection sent Successfully!!",
        });
      }
    } catch (err) {
      res.send(err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).send("No such connection request!!");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Updated the connection Request Status",
        data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

module.exports = requestRouter;
