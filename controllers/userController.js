const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const getIdbyToken = require('../utils/getIdbyToken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await User.hashPassword(password);
        const userId = await User.createUser(name, email, hashedPassword);
        const token = User.signToken(userId, name, email);
        const response = await User.getUserById(userId);
        res.status(201).json({ id: response[0].id, name: response[0].name, email: response[0].email, picpath: response[0].picpath, token });
    } catch (err) {
        console.error('Error in registration:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }
        const user = (await User.getUserByName(name))[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = User.signToken(user.id, user.name, user.email);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, picpath: user.picpath, token });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(401).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    const id = req.user.id;
    try {
        const user = await User.getUserById(id);
        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getUserById(id);
        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        const user = await User.getUserByName(name);
        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.uploadProfileImage = async (req, res) => {
    const image = req.file;
    const userId = getIdbyToken(req.headers.authorization);
    if (!image) {
        return res.status(400).json({ error: 'No image file provided' });
    }
    try {
        const fileExtension = path.extname(image.originalname);
        const tempPath = image.path;
        const newPath = `${tempPath}${fileExtension}`;
        fs.renameSync(tempPath, newPath);
        await User.updateProfileImage(userId, newPath);
        const updatedUser = await User.getUserById(userId);
        res.json(updatedUser[0]);
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
