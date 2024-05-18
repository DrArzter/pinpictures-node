const jwt = require('jsonwebtoken');
const { env } = require('process');
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
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401);
    }
};
