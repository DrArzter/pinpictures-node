const jwt = require('jsonwebtoken');
const { env } = require('process');
const Post = require('../models/postModel');

const CHECK_ACESS_TO_POST = require('../models/postQueries').CHECK_ACESS_TO_POST;
const getIdbyToken = require('../utils/getIdbyToken');
const jwtSecretKey = env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.cookies["token"];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        userId = getIdbyToken(authHeader);

        Post.checkAccessToPost(userId, req.params.id)
            .then((result) => {
                console.log(result);
                result = result[0]['COUNT(*)'];
                console.log(result);
                
                if (result === 0) {
                    res.status(404).json({ status: 'error', message: 'Post not found or you are not the owner' });
                    return;
                }
                next();
            })
            .catch((error) => {
                return res.status(401).json({ status: 'error', message: 'Unauthorized' });
            });
    } catch (error) {
        return res.status(401);
    }
};
