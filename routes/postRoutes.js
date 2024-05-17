const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const uploadPost = multer({ dest: 'uploads/posts' });

router.get('/', postController.getAllPosts);
router.post('/', uploadPost.single('image'), authMiddleware, postController.createPost);

// Дополнительные маршруты для получения, обновления и удаления постов

module.exports = router;
