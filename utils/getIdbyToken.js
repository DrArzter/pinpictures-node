const jwt = require('jsonwebtoken');
const { env } = require('process');
const jwtSecretKey = env.JWT_SECRET;

module.exports = function getIdbyToken(req) {
    const token = req.cookies["token"];
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded.id;
}