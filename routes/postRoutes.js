const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const imageMiddleware = require('../middlewares/imageMiddleware');
const postValidator = require('../middlewares/validators/postValidator');
const validator = require('../middlewares/validator');
const multer = require('multer');

const uploadPost = multer({ dest: 'uploads/posts' });

router.get('/:page', validator, postValidator.validateGetAllPosts, postController.getAllPosts);

router.post('/', validator, postValidator.validateCreatePost, uploadPost.array('images', 10), authMiddleware, postController.createPost);

router.get('/id/:id', validator, postController.getPostById);

router.delete('/id/:id', validator, authMiddleware, ownerMiddleware, postController.deletePost);

router.put('/rating/:id', validator, authMiddleware, postController.updateRating);

router.post('/like/:id', validator, authMiddleware, postController.likePost);

module.exports = router;
