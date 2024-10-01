const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validator');
const multer = require('multer');
const uploadComment = multer({ dest: 'uploads/comments' });

router.get('/', validate, commentController.getAllComments);
router.post('/', validate, authMiddleware, uploadComment.single('image'), commentController.createComment);
router.get('/:id', validate, commentController.getCommentById);
router.delete('/:id', validate, authMiddleware, commentController.deleteComment);

module.exports = router;