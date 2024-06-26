const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const getIdbyToken = require('../utils/getIdbyToken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await User.hashPassword(password);
        const user = await User.createUser(name, email, hashedPassword);
        const token = User.signToken(user, name, email);
        const response = await User.getUserById(user); 
        res.status(201).json({ id: response[0].id, name: response[0].name, email: response[0].email, picpath: response[0].picpath, token });
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
        const uploadImage = await User.updateProfileImage(userId, newPath);
        const updatedUser = await User.getUserById(userId);
        res.json(updatedUser[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
