const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const uploadUser = multer({ dest: 'uploads/users' });

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/friend', authMiddleware, userController.addFriend);
router.post('/friend/accept', authMiddleware, userController.acceptFriend);
router.post('/friend/decline', authMiddleware, userController.declineFriend);
router.post('/friend/remove', authMiddleware, userController.removeFriend);

router.get('/', authMiddleware, userController.getUser);
router.get('/by-id/:id', userController.getUserById);
router.get('/by-name/:name', userController.getUserByName);
router.post('/:id/image', authMiddleware, uploadUser.single('image'), userController.uploadProfileImage);

module.exports = router;