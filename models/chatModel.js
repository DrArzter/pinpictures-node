const pool = require('../config/db');

exports.getChatsByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM chats c JOIN users_in_chats uic ON c.id = uic.chatid WHERE uic.userid = ?', [userId]);
    return rows;
}

exports.createChat = async (chat) => {
    const [result] = await pool.query('INSERT INTO chats SET ?', chat);
    return result.insertId;
}