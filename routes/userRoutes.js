const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const uploadUser = multer({ dest: 'uploads/posts' });

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authMiddleware, userController.getUser);

module.exports = router;