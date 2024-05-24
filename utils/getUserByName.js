const userModel = require('../models/userModel');

module.exports = async function getUserByName(name) {
    return await userModel.getUserByName(name);
}