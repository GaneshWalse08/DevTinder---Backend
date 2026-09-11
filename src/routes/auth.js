const express = require("express");
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt');


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

  try {

  // Validate the user 

  validateSignUpData(req);

  // Encrypt the password

  const {firstName, lastName, emailId, password, age, gender} = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  //Create the instance of the User and save

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender
    });

    await user.save();
    res.send("User added!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async(req,res) => {
  try{

    const {emailId, password} = req.body;

    const user = await User.findOne({emailId});

    if(!user){
      throw new Error("No Such User Found!!");
    }

    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
      // Create a JWT token  

      const token = await user.getJWT();
      
      
      // Add the token to cookie and send it to the user for authentication
      res.cookie("token", token);

      res.send("Login Successful...");
    } else {
      res.send("Login Failed!!")
    }

  }catch(err){
    // console.log(err.message);
    res.status(400).send(err.message);
  }
})

authRouter.post("/logout", (req,res) => {
  try{

    const {token} = req.cookies;

    res.cookie("token", token, {
      expires: new Date(Date.now())
    })

  // res.clearCookie("token");
  
  res.send("Logout Successful...");
  
} catch(err){
    res.send(err.message);
  }
} );



module.exports = authRouter;