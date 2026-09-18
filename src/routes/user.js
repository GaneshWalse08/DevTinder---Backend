const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
  "githubUrl",
  "linkedinUrl"
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });

    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 15;
  const skip = (page-1)*limit;

  if(limit > 100 || limit <= 0){
    limit = 10;
  }

  if(page <= 0){
    page = 1;
  }

  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  }).select("fromUserId toUserId");

  const hideUserFromFeed = new Set();

  connectionRequests.forEach((req) => {
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
  });

  const Users = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUserFromFeed) } },
      { _id: { $ne: loggedInUser._id } },
    ],
  }).select(USER_SAFE_DATA).skip(skip).limit(limit);

  res.send(Users);
});


module.exports = userRouter;
