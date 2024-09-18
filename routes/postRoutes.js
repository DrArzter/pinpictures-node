const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const imageMiddleware = require('../middlewares/imageMiddleware');
const multer = require('multer');

const uploadPost = multer({ dest: 'uploads/posts' });

router.get('/', postController.getAllPosts);
router.post('/', authMiddleware, uploadPost.array('images', 10), postController.createPost);

router.get('/search', postController.searchPosts); 

router.get('/id/:id', postController.getPostById);

router.delete('/id/:id', authMiddleware, ownerMiddleware, postController.deletePost);

router.put('/rating/:id', authMiddleware, postController.updateRating);

router.post('/like/:id', authMiddleware, postController.likePost);

module.exports = router;
