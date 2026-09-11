const User = require("../models/user");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userAuth = async (req, res, next) => {
  /**
   * Read the token from cookie
   * validate the token
   * Find the user
   */

  try{
    const cookie = req.cookies;

  const {token} = cookie;

  if(!token){
    throw new Error("Invalid Token!");
  }

  const decodedMsg = jwt.verify(token, "DevTinder@Ganesh$08");

  const {_id} = decodedMsg;

  const user = await User.findById(_id);



  if(!user){
    throw new Error("No such User!!");
  }

  req.user = user;

  next();
  }
  catch(err){
    res.send(err.message);
  }
}

module.exports = {
  userAuth,
}
