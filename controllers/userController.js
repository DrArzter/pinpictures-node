const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const getIdbyToken = require('../utils/getIdbyToken');
const removePassword = require('../utils/removePassword');

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
        res.cookie('token', token);
        res.status(201).json({ id: response.id, name: response.name, email: response.email, picpath: response.picpath });
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
        const user = (await User.getUserByName(name));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = User.signToken(user.id, user.name, user.email);
        res.cookie('token', token, { SameSite: 'none' });
        res.status(200).json({ id: user.id, name: user.name, email: user.email, picpath: user.picpath });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(401).json({ message: err.message });
    }
};

exports.logout = (_req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getUser = async (req, res) => {
    const id = req.user.id;
    try {
        let user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user = await removePassword(user);
        const sessionToken = User.signSessionToken(user.id, user.name, user.email);
        res.json({ ...user, sessionToken });
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
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        let user = await User.getUserByName(name);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user = await removePassword(user);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.uploadProfileImage = async (req, res) => {
    const image = req.file;
    const userId = getIdbyToken(req);
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

exports.getFriends = async (req, res) => {
    const { name } = req.params;
    try {
        const user = await User.getUserByName(name);
        const friends = await User.getFriends(user.id);
        res.json(friends);
    } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = getIdbyToken(req);
    console.log(userId, friendId);
    try {
        await User.addFriend(userId, friendId);
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.confirmFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = getIdbyToken(req);
    try {
        await User.confirmFriend(userId, friendId);
        res.status(200).json({ message: 'Friend accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.declineFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = getIdbyToken(req);
    try {
        await User.declineFriend(userId, friendId);
        res.status(200).json({ message: 'Friend declined successfully' });
    } catch (error) {
        console.error('Error declining friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.removeFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = getIdbyToken(req);
    try {
        await User.removeFriend(userId, friendId);
        res.status(200).json({ message: 'Friend deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
