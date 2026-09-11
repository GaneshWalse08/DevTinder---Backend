const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/auth");
const requestRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
