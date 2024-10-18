const pool = require('../config/db');

exports.getChatsByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT 
            c.id AS chatId, 
            c.chat_type, 
            c.name AS chatName, 
            c.picpath AS chatPic,
            -- Определяем отображаемое имя и картинку
            IF(c.chat_type = 'private', u.name, c.name) AS displayName,
            IF(c.chat_type = 'private', u.picpath, c.picpath) AS displayPic,
            m.message, 
            m.created_at AS messageTimestamp, 
            ua.name AS messageAuthorName
        FROM chats c
        JOIN users_in_chats uc ON c.id = uc.chatid
        LEFT JOIN (
            -- Получаем последнее сообщение в каждом чате
            SELECT chatid, message, userid, created_at
            FROM messages_in_chats
            WHERE (chatid, created_at) IN (
                SELECT chatid, MAX(created_at)
                FROM messages_in_chats
                GROUP BY chatid
            )
        ) m ON c.id = m.chatid
        LEFT JOIN users ua ON m.userid = ua.id
        LEFT JOIN users_in_chats uc2 ON c.id = uc2.chatid AND uc2.userid != ?
        LEFT JOIN users u ON uc2.userid = u.id
        WHERE uc.userid = ?
    `, [userId, userId]);

    return rows;
};


exports.getMessagesByChatId = async (chatId) => {
    const [rows] = await pool.query(`
        SELECT 
            m.id, 
            m.userid, 
            m.chatid, 
            m.message, 
            m.created_at, 
            u.name AS senderName, 
            u.picpath AS senderPic
        FROM messages_in_chats m
        JOIN users u ON m.userid = u.id
        WHERE m.chatid = ?
        ORDER BY m.created_at ASC
    `, [chatId]);

    return rows;
};

exports.isUserInChat = async (userId, chatId) => {
    const [rows] = await pool.query(
        'SELECT * FROM users_in_chats WHERE userid = ? AND chatid = ?', 
        [userId, chatId]
    );
    return rows.length > 0;
};

exports.saveMessage = async (message) => {
    const [result] = await pool.query(
        'INSERT INTO messages_in_chats (userid, chatid, message) VALUES (?, ?, ?)', 
        [message.senderId, message.chatId, message.message]
    );
    const messageId = result.insertId;
    const [rows] = await pool.query(`
        SELECT 
            m.id, 
            m.userid, 
            m.chatid, 
            m.message, 
            m.created_at, 
            u.name AS senderName, 
            u.picpath AS senderPic
        FROM messages_in_chats m
        JOIN users u ON m.userid = u.id
        WHERE m.id = ?
    `, [messageId]);
    return rows[0];
};

exports.getUsersInChat = async (chatId) => {
    const [rows] = await pool.query(
        'SELECT userid FROM users_in_chats WHERE chatid = ?', 
        [chatId]
    );
    return rows.map(row => row.userid);
};
