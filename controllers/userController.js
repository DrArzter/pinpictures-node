const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await User.hashPassword(password);
        const user = await User.createUser(name, email, hashedPassword);
        const token = User.signToken(user.id, user.name, user.email);
        const response = await User.getUserById(user.id); // Передаем user.id вместо user
        res.status(201).json({ id: response.id, name: response.name, email: response.email, picpath: response.picpath, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = (await User.getUserByName(name))[0];
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = User.signToken(user.id, user.name, user.email);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, picpath: user.picpath, token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    const id = req.user.id;
    try {
        const user = await User.getUserById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getUserById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        const user = await User.getUserByName(name);
        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
