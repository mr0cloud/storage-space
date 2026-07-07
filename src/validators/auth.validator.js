const {body} = require("express-validator");

const signupValidator = [
    body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required"),

    body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email is required"),

    body("password")
    .isLength({min:6}).withMessage("Password must be at least 6 characters")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number")
     .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain a special character"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Must be a valid email address"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

module.exports = {
    signupValidator,
    loginValidator
}