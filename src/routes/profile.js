const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData, validPassword} = require("../utils/validation");
const User = require("../models/user");
const validator = require('validator');
const bcrypt = require('bcrypt');

const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");

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

    const { firstName, lastName, age, photoUrl, skills, gender, githubUrl, linkedinUrl, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        age,
        photoUrl,
        skills,
        gender,
        githubUrl,
        linkedinUrl,
        about,
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
    res.status(400).send(err.message);
  }
})

profileRouter.post(
  "/profile/photoupload",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "devtinder/profile",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      res.status(200).json({
        message: "Photo uploaded successfully",
        url: result.secure_url,
      });
    } catch (err) {
      console.log("Photo upload error:", err);

      res.status(500).json({
        message: "Failed to upload photo",
      });
    }
  }
);

module.exports = profileRouter;
