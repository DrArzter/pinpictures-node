const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { env } = require('process');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await User.hashPassword(password);
        const user = await User.createUser(name, email, hashedPassword);
        const token = User.signToken(user.id, user.name, user.email);
        const response = await User.getUserById(user);
        res.status(201).json({ id: response.id, name: response.name, email: response.email, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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
        const token = User.signToken(user.id, user.name, user.email);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    res.status(200).json({ id: req.user.id, name: req.user.name, email: req.user.email });
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const [rows] = await User.getUserById(id);
    res.json(rows);
};

exports.getUserByName = async (req, res) => {
    const { name } = req.params;
    const [rows] = await User.getUserByName(name);
    res.json(rows);
};
