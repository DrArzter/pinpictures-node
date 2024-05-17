const jwt = require('jsonwebtoken');
const jwtSecretKey = 'mysecretkey';

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
};
