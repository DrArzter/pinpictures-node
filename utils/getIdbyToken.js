const jwt = require('jsonwebtoken');
const { env } = require('process');
const jwtSecretKey = env.JWT_SECRET;

module.exports = function getIdbyToken(authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded.id;
}