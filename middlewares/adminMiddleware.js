const jwt = require('jsonwebtoken');
const { env } = require('process');
const getUserById = require('../utils/getUserById');
const jwtSecretKey = env.JWT_SECRET;

module.exports = (req, res, next) => {

    const token = req.cookies["token"];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;
        let bananaLevel = 0;
        getUserById(req.user.id)
            .then(result => {
                bananaLevel = result.bananaLevel;

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
