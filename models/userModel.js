const pool = require('../config/db');

exports.createUser = async (name, email, password) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return result.insertId;
}

exports.getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

exports.getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
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

exports.getUserByName = async (name) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
    return rows[0];
}

