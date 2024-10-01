const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validator');
const multer = require('multer');
const uploadComment = multer({ dest: 'uploads/chats' });

router.get('/', validate, authMiddleware, chatController.getChatsByUserId);
router.post('/', validate, authMiddleware, chatController.createChat);
router.post('/messages/:id', validate, authMiddleware, chatController.uploadMessage);
router.get('/:id', validate, authMiddleware, chatController.getChatById);
router.get('/messages/:id', validate, authMiddleware, chatController.getMessages);

module.exports = router;
