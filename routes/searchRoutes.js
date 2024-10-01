const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const searchController = require('../controllers/searchController');
const searchValidator = require('../middlewares/validators/searchValidator');

router.get('/:searchTerm', searchValidator.validateSearch, validator, searchController.search);

module.exports = router