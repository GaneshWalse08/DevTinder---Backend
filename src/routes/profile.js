const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData, validPassword} = require("../utils/validation");
const User = require("../models/user");
const validator = require('validator');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request!!");
    }

    const { age, photoUrl, skills, gender, githubUrl, linkedinUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        age,
        photoUrl,
        skills,
        gender,
        githubUrl,
        linkedinUrl,
      },
      { new: true, runValidators: true }
    );

    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req,res) =>{
  try{
    validPassword(req);

    const hashPassword = await bcrypt.hash(req.body.password , 10); 

    const updatedUser = await User.findByIdAndUpdate(req.user._id , {
      password: hashPassword,
    }, { new: true, runValidators: true })

    res.send(updatedUser);
  } catch(err){
    res.send(err.message);
  }
})

module.exports = profileRouter;
