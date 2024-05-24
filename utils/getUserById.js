const userModel = require('../models/userModel');

module.exports = async function getUserById(id) {
    return await userModel.getUserById(id);
}