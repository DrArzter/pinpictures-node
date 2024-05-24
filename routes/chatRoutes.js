const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const uploadComment = multer({ dest: 'uploads/chats' });

router.get('/', authMiddleware, chatController.getChatsByUserId);
router.post('/', authMiddleware, chatController.createChat);
router.post('/messages/:id', authMiddleware, chatController.uploadMessage);
router.get('/:id', authMiddleware, chatController.getChatById);
router.get('/messages/:id', authMiddleware, chatController.getMessages);

module.exports = router;
