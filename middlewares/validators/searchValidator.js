const { check } = require("express-validator");

exports.validateSearch = [
    check("searchTerm")
    .notEmpty()
    .withMessage("Search term is required"),
    
    check("searchTerm")
    .isLength({ max: 100 })
    .withMessage("Search term must be less than 100 characters"),
]
