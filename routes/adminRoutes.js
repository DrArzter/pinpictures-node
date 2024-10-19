const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const multer = require('multer');

router.post('/ban', adminMiddleware, adminController.banUser);
router.get('/posts', adminMiddleware, adminController.getPosts);
router.get('/users', adminMiddleware, adminController.getUsers);
router.get('/chats', adminMiddleware, adminController.getChats);

router.post('/user/:id', authMiddleware, adminController.userAction);

module.exports = router;