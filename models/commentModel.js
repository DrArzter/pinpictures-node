const pool = require('../config/db');

exports.createComment = async (comment) => {
    const [result] = await pool.query('INSERT INTO comments SET ?', comment);
    return result.insertId;
}

exports.getCommentById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    return rows;
}

exports.deleteComment = async (id) => {
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows;
}

exports.updateComment = async (id, comment) => {
    const [result] = await pool.query('UPDATE comments SET ? WHERE id = ?', [comment, id]);
    return result.affectedRows;
}