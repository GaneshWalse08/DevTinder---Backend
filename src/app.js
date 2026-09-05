const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express();

app.post("/signup", async (req,res) => {
  const user = new User({
    firstName: "ganesh",
    lastName: "Walse",
    emailId: "ganesh@gmail.com",
    password: "ganesh@11",
    age: 21,
    gender: "Male"
  })

  await user.save();
  res.send("User added!");

})

connectDB().then(() => {
  console.log("Database connected Successfully....")
  app.listen(8080, () => {
    console.log("Server is running on port 8080....");
  })
})
.catch((err) => {
  console.log("Something went wrong....");
})