const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "others"]) {
          throw new Error("Gender data is not Valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1740252117044-2af197eea287?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    about: {
      type: String,
      default: "This is default about the user....",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 8) {
          throw new Error("You can add maximum 8 skills!");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DevTinder@Ganesh$08", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;

  const isValidPassword = await bcrypt.compare(passwordInputByUser, user.password);

  return isValidPassword;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
