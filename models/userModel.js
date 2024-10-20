const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { use } = require('../routes/userRoutes');
const { v4: uuidv4 } = require('uuid');


exports.getFriends = async (userId) => {
    try {
        const [result] = await pool.query(
            `SELECT 
                u.id, u.name, u.email, u.picpath, u.bgpicpath,
                f.status 
            FROM users u
            INNER JOIN friendships f ON (
                (f.user1_id = ? AND f.user2_id = u.id) OR 
                (f.user2_id = ? AND f.user1_id = u.id)
            )
            WHERE u.id != ?`,
            [userId, userId, userId] 
        );
        return result;
    } catch (error) {
        throw new Error('Error getting friends: ' + error.message);
    }
};

exports.removeFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM friendships WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
            [userId, friendId, userId, friendId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error removing friend: ' + error.message);
    }
};

exports.declineFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM friendships WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)',
            [userId, friendId, userId, friendId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error declining friend: ' + error.message);
    }
};

exports.confirmFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'UPDATE friendships SET status = ? WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)',
            ['confirmed', userId, friendId, userId, friendId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error confirming friend: ' + error.message);
    }
};

exports.addFriend = async (userId, friendId) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO friendships (user1_id, user2_id, status) VALUES (?, ?, ?)',
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

exports.getUsersByEmail = async (email) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user by email: ' + error.message);
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

exports.getUsersById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching users by ID: ' + error.message);
    }
};

exports.getUserById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user by ID: ' + error.message);
    }
};

exports.getUsersByName = async (name) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE name LIKE ?', [`%${name}%`]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching users by name: ' + error.message);
    }
};

exports.getUserByName = async (name) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user by name: ' + error.message);
    }
};

exports.getAllUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM users u');
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

exports.signSessionToken = (id, name, email) => {
    return jwt.sign(
        { 
            id,
            type: 'temporary',
            sessionId: uuidv4(),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
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
