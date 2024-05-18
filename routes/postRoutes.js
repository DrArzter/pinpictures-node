const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const uploadPost = multer({ dest: 'uploads/posts' });

router.get('/', postController.getAllPosts);
router.post('/', authMiddleware, uploadPost.single('image'), postController.createPost);
router.get('/:id', postController.getPostById);
router.delete('/:id', authMiddleware, postController.deletePost);
router.put('/rating/:id', authMiddleware, postController.updateRating);

module.exports = router;