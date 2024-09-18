const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.removeFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM friends WHERE user_id = ? AND friend_id = ?',
            [userId, friendId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error removing friend: ' + error.message);
    }
};

exports.declineFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM friends WHERE user_id = ? AND friend_id = ?',
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error declining friend: ' + error.message);
    }
};

exports.acceptFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?',
            ['accepted', userId, friendId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error confirming friend: ' + error.message);
    }
};

exports.addFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
            [userId, friendId, 'pending']
        );
        return result.insertId;
    } catch (error) {
        throw new Error('Error adding friend: ' + error.message);
    }
};

exports.createUser = async (name, email, password) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, picpath, bgpicpath) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, `https://ui-avatars.com/api/?name=${name}&background=ACACAC&color=fff`, `https://ui-avatars.com/api/?name=${name}&background=ACACAC&color=fff`]
        );
        return result.insertId;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user by email: ' + error.message);
    }
};

exports.getUserById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching user by ID: ' + error.message);
    }
};

exports.getUserByName = async (name) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching user by name: ' + error.message);
    }
};

exports.getAllUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw new Error('Error fetching all users: ' + error.message);
    }
};

exports.updateUser = async (id, name, email, password) => {
    try {
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

exports.deleteUser = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};

exports.verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

exports.signToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

exports.updateProfileImage = async (id, imagePath) => {
    try {
        const [result] = await pool.query('UPDATE users SET picpath = ? WHERE id = ?', [imagePath, id]);
        return result;
    } catch (error) {
        throw new Error('Error updating profile image: ' + error.message);
    }
};
