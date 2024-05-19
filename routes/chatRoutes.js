const express = require('express');
const router = express.Router();
const commentController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const uploadComment = multer({ dest: 'uploads/chats' });

router.get('/', commentController.getChatsByUserId);
router.post('/', authMiddleware, commentController.createChat);

module.exports = router;
