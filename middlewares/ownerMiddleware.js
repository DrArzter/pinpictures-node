const jwt = require('jsonwebtoken');
const { env } = require('process');

const CHECK_ACESS_TO_POST = require('../models/postQueries').CHECK_ACESS_TO_POST;
const getIdbyToken = require('../utils/getIdbyToken');
const jwtSecretKey = env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        userId = await getIdbyToken(req.headers.authorization);
        console.log(userId)
        const post = await CHECK_ACESS_TO_POST(userId, req.params.postId);
        console.log(post)
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Post not found or you are not the owner' });
        }
        next();
    } catch (error) {
        return res.status(401);
    }
};
