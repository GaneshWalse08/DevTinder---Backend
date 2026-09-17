require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");



const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected Successfully....");
    app.listen(8080, () => {
      console.log("Server is running on port 8080....");
    });
  })
  .catch((err) => {
    console.log("Something went wrong....");
  });
