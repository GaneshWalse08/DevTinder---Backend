
const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      githubUrl,
      linkedinUrl,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      skills,
      githubUrl,
      linkedinUrl,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User added!",
      data: savedUser,
    });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already registered. Please login!",
      });
    }

    return res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid Credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid Credentials!");
    }

    const token = await user.getJWT();

    res.cookie("token", token, cookieOptions);

    // Do not send the password hash to the frontend
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json(safeUser);

  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid Credentials!");
  }
});

// LOGOUT
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).send("Logout Successful");
});

module.exports = authRouter;
