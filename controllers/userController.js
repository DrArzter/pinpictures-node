const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await User.hashPassword(password);
        const user = await User.createUser(name, email, hashedPassword);
        res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.getUserByName(name);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        res.status(200).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}