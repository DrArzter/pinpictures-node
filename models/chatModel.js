const pool = require("../config/db");

exports.getChatsByUserIdFromDb = async (userId) => {
    const query = `
        SELECT 
            c.id AS chatId,
            c.picpath,
            (
                SELECT JSON_ARRAYAGG(u.name) 
                FROM users u 
                WHERE uic.chatid = c.id
            ) AS users,
            (
                SELECT mic.message 
                FROM messages_in_chats mic 
                WHERE mic.chatid = c.id 
                ORDER BY mic.created_at DESC 
                LIMIT 1
            ) AS lastMessage
        FROM 
            chats c 
            JOIN users_in_chats uic ON c.id = uic.chatid 
        WHERE 
            uic.userid = ?
        GROUP BY 
            c.id
    `;

    const [rows] = await pool.query(query, [userId]);
    return rows;
};

exports.getMessagesByTimestamp = async (userId, chatId, timestamp) => {
    const query = `
        SELECT 
            u.name AS author, 
            u.picpath, 
            mic.message, 
            mic.created_at
        FROM 
            messages_in_chats mic
        JOIN 
            users u ON mic.userid = u.id
        WHERE 
            mic.chatid = ?
            AND mic.created_at > ?
        ORDER BY 
            mic.created_at ASC
    `;
    const [rows] = await pool.query(query, [chatId, timestamp]);
    return rows;
};

exports.createChat = async ({ user1, user2 }) => {
    const query = 'INSERT INTO chats (picpath) VALUES (?)';
    const [result] = await pool.query(query, ['']);

    const query2 = 'INSERT INTO users_in_chats (userid, chatid) VALUES (?, ?)';
    await pool.query(query2, [user1, result.insertId]);
    await pool.query(query2, [user2, result.insertId]);
    
    return result.insertId;
};

exports.getChatById = async (id) => {
    const query = `
        SELECT 
            u.name AS author, 
            u.picpath, 
            mic.message, 
            mic.created_at
        FROM 
            messages_in_chats mic
        JOIN 
            users u ON mic.userid = u.id
        WHERE 
            mic.chatid = ?
        ORDER BY 
            mic.created_at ASC
    `;
    const [rows] = await pool.query(query, [id]);
    return rows;
};

exports.uploadMessage = async (userId, chatId, message) => {
    const query = 'INSERT INTO messages_in_chats (userid, chatid, message) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [userId, chatId, message]);    
    const responseQuery = `
    SELECT 
        u.name AS author,
        u.picpath,
        mic.message,
        mic.created_at
    FROM
        messages_in_chats mic
    JOIN
        users u ON mic.userid = u.id
    WHERE
        mic.chatid = ?
        AND mic.id = ?
    `;
    const [response] = await pool.query(responseQuery, [chatId, result.insertId]);
    if (result.affectedRows > 0) {
        return response;
    } else {
        return null;
    }   
};