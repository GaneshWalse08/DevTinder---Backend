const validator = require("validator");

// ==========================================
// SIGNUP VALIDATION
// ==========================================

const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    photoUrl,
    githubUrl,
    linkedinUrl,
  } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not Valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a Valid Email ID....");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password....");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid Photo Url");
  } else if (linkedinUrl && !validator.isURL(linkedinUrl)) {
    throw new Error("Invalid LinkedIn Profile");
  } else if (githubUrl && !validator.isURL(githubUrl)) {
    throw new Error("Invalid github Url");
  }

  return true;
};

// ==========================================
// EDIT PROFILE VALIDATION
// ==========================================

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "skills",
    "linkedinUrl",
    "githubUrl",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid Edit Request!!");
  }

  return true;
};

// ==========================================
// PASSWORD VALIDATION
// ==========================================

const validPassword = (req) => {
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password!!");
  }

  return true;
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validPassword,
};