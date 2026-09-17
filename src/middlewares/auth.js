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
    return res.status(401).send("Please Login!");
  }

  const decodedMsg = jwt.verify(token, JWT_SECRET_KEY);

  const {_id} = decodedMsg;

  const user = await User.findById(_id);



  if(!user){
    throw new Error("No such User!!");
  }

  req.user = user;

  next();
  }
  catch(err){
    res.status(401).send(err.message);
  }
}

module.exports = {
  userAuth,
}
