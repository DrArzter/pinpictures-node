const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const validator = require('../middlewares/validator');
const userValidator = require('../middlewares/validators/userValidator');
const multer = require('multer');

const uploadUser = multer({ dest: 'uploads/users' });

router.post('/register', userValidator.validateRegister, validator, userController.register);
router.post('/login', userValidator.validateLogin, validator, userController.login);

router.get('/friend/:name', validator, userController.getFriends);
router.post('/friend', validator, authMiddleware, userController.addFriend);
router.post('/friend/accept', validator, authMiddleware, userController.acceptFriend);
router.post('/friend/decline', validator, authMiddleware, userController.declineFriend);
router.post('/friend/remove', validator, authMiddleware, userController.removeFriend);

router.get('/', validator, authMiddleware, userController.getUser);
router.get('/by-id/:id', validator, userController.getUserById);
router.get('/by-name/:name', validator, userController.getUserByName);
router.post('/:id/image', validator, authMiddleware, uploadUser.single('image'), userController.uploadProfileImage);

module.exports = router;