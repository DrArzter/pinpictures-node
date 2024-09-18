const jwt = require('jsonwebtoken');
const { env } = require('process');
const Post = require('../models/postModel');

const CHECK_ACESS_TO_POST = require('../models/postQueries').CHECK_ACESS_TO_POST;
const getIdbyToken = require('../utils/getIdbyToken');
const jwtSecretKey = env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        userId = getIdbyToken(req.headers.authorization);
        console.log(userId)
        Post.checkAccessToPost(userId, req.params.id)
            .then((result) => {
                console.log(result)
                if (result.length === 0) {
                    return res.status(404).json({ status: 'error', message: 'Post not found or you are not the owner' });
                }
            })
            .catch((error) => {
                return res.status(401).json({ status: 'error', message: 'Unauthorized' });
            });
        next();
    } catch (error) {
        return res.status(401);
    }
};
