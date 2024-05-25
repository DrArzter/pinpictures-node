const pool = require('../config/db');
jwt = require('jsonwebtoken');
require('dotenv').config();
bcrypt = require('bcrypt');


exports.createUser = async (name, email, password) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, picpath) VALUES (?, ?, ?, ?)',
        [name, email, password, "https://ui-avatars.com/api/?name=" + name + "&color=121212&background=D1D5DB"]
    );
    return result.insertId;
}

exports.getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

exports.getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows;
};

exports.getUserByName = async (name) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
    return rows;
}

exports.getAllUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

exports.updateUser = async (id, name, email, password) => {
    const [result] = await pool.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
    return result.affectedRows;
}

exports.deleteUser = async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
}

exports.verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

exports.signToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

exports.hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

exports.updateProfileImage = async (id, imagePath) => {
    const [result] = await pool.query('UPDATE users SET picpath = ? WHERE id = ?', [imagePath, id]);
    return result
};



