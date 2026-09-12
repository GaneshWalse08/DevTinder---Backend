const validator = require("validator");

const validateSignUpData = (req) => {
  const {firstName, lastName, emailId, password} = req.body;

  if(!firstName || !lastName){
    throw new Error("Name is not Valid!");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Enter a Valid Email ID....");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Enter a Strong Password....");
  }
}

const validateEditProfileData = (req) => {

  const allowedEditFields = ["firstName", "lastName", "emailId", "password", "age", "photoUrl", "gender", "skills"];

  
   const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
}

const validPassword = (req) => {
  const {password} = req.body;
  if(!validator.isStrongPassword(password)){
    throw new Error("Enter Strong Password!!");
  }

}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validPassword
}