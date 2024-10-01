const { check } = require("express-validator");

exports.validateGetAllPosts = [
    check("page")
        .isNumeric().withMessage("Page must be a number"),
]

exports.validateCreatePost = [

    check("name")
        .notEmpty()
        .isLength({ min: 3 })
        .isLength({ max: 20 })
        .withMessage("Name must be between 3 and 20 characters"),

    check("description")
        .notEmpty()
        .isLength({ min: 3 })
        .isLength({ max: 200 })
        .withMessage("Description is required"),

];