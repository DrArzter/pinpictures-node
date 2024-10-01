const { check } = require("express-validator");

exports.validateRegister = [
    check("name").notEmpty().withMessage("Name is required"),

    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email"),

    check("password").notEmpty().withMessage("Password is required"),
];

exports.validateLogin = [
    check("name").notEmpty().withMessage("Name is required"),
    check("password").notEmpty().withMessage("Password is required"),
];
