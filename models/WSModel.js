const pool = require('../config/db');

exports.getOrCreatePrivateChat = async (userId1, userId2) => {

    const [existingChat] = await pool.query(`
        SELECT c.id 
        FROM chats c
        JOIN users_in_chats uc1 ON c.id = uc1.chatid AND uc1.userid = ?
        JOIN users_in_chats uc2 ON c.id = uc2.chatid AND uc2.userid = ?
        WHERE c.chat_type = 'private'
    `, [userId1, userId2]);

    if (existingChat.length > 0) {
        return existingChat[0].id;
    }

    // Если чата нет, создаем новый
    const [newChat] = await pool.query(`
        INSERT INTO chats (name, chat_type) 
        VALUES ('Private Chat', 'private')
    `);

    const chatId = newChat.insertId;

    await pool.query(`
        INSERT INTO users_in_chats (userid, chatid)
        VALUES (?, ?), (?, ?)
    `, [userId1, chatId, userId2, chatId]);

    return chatId;
};

exports.checkPrivateChatExists = async (userId1, userId2) => {

    const [existingChat] = await pool.query(`
        SELECT c.id 
        FROM chats c
        JOIN users_in_chats uc1 ON c.id = uc1.chatid AND uc1.userid = ?
        JOIN users_in_chats uc2 ON c.id = uc2.chatid AND uc2.userid = ?
        WHERE c.chat_type = 'private'
    `, [userId1, userId2]);

    if (existingChat.length > 0) {
        return existingChat[0].id;
    }

    return null;
}

exports.createChat = async ({ user1, user2 }) => {
    if (!user1 || !user2 || user1 === user2) {
        throw new Error('Invalid users: both users must be provided and cannot be the same.');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const query = 'INSERT INTO chats (picpath) VALUES (?)';
        const [result] = await connection.query(query, ['']);

        const query2 = 'INSERT INTO users_in_chats (userid, chatid) VALUES (?, ?), (?, ?)';
        await connection.query(query2, [user1, result.insertId, user2, result.insertId]);

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback(); // Отменяем всю пиздобратию если мы объебались, то-то же ёбана
        throw error;
    } finally {
        connection.release();
    }
};


// Получаем чаты пользователя по userId
exports.getChatsByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT 
            c.id AS chatId, 
            c.chat_type, 
            MAX(c.name) AS chatName, 
            MAX(c.picpath) AS chatPic,
            -- Определяем отображаемое имя и картинку
            IF(c.chat_type = 'private', MAX(u.name), MAX(c.name)) AS displayName,
            IF(c.chat_type = 'private', MAX(u.picpath), MAX(c.picpath)) AS displayPic,
            MAX(m.message) AS message, 
            MAX(m.created_at) AS messageTimestamp, 
            MAX(ua.name) AS messageAuthorName
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
        GROUP BY c.id
    `, [userId, userId]);

    return rows;
};

// Получаем сообщения по chatId
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

// Проверяем, есть ли пользователь в чате
exports.isUserInChat = async (userId, chatId) => {
    const [rows] = await pool.query(
        'SELECT * FROM users_in_chats WHERE userid = ? AND chatid = ?', 
        [userId, chatId]
    );
    return rows.length > 0;
};

// Сохраняем сообщение
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

// Получаем пользователей, находящихся в чате
exports.getUsersInChat = async (chatId) => {
    const [rows] = await pool.query(
        'SELECT userid FROM users_in_chats WHERE chatid = ?', 
        [chatId]
    );
    return rows.map(row => row.userid);
};
