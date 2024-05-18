const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const uploadComment = multer({ dest: 'uploads/comments' });

router.get('/', commentController.getAllComments);
router.post('/', authMiddleware, uploadComment.single('image'), commentController.createComment);
router.get('/:id', commentController.getCommentById);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;