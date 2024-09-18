const jwt = require('jsonwebtoken');
const { env } = require('process');
const checkToken = require('../utils/getUserById');
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
        let bananaLevel = 0;
        checkToken(req.user.id)
            .then(result => {
                bananaLevel = result[0].bananaLevel;
                console.log('Banana level:', bananaLevel);
                if (bananaLevel < 2) {
                    return res.status(401).json({ status: 'error', message: 'Не твоего банана дело' });
                }
            
                next();
            })
            .catch(error => {
                console.error(error);
                return res.status(401).json({ status: 'error', message: 'Не твоего банана дело' });
            });

        
    } catch (error) {
        return res.status(401);
    }
};
