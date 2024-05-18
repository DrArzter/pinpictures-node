const jwt = require('jsonwebtoken');
const { env } = require('process');
const jwtSecretKey = env.JWT_SECRET;

module.exports = async function getIdbyToken(authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log(decoded.id);
    return decoded.id;
}