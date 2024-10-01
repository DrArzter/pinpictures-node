const { check } = require("express-validator");

exports.validateGetAllComments = [
    check("page")
        .isNumeric()
        .withMessage("Page must be a number"),
]

exports.validateCreateComment = [
    check("content")
        .notEmpty()
        .withMessage("Content is required"),
]