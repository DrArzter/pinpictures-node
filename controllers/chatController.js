const Chat = require('../models/chatModel');
const getIdbyToken = require('../utils/getIdbyToken');

exports.getChatsByUserId = async (req, res) => {
    const id = await getIdbyToken(req.headers.authorization);
    const chats = await Chat.getChatsByUserId(id);
    res.status(200).json(chats);
}

exports.createChat = async (req, res) => {
    const user1 = await getIdbyToken(req.headers.authorization);
    const user2 = req.params.id;
    const [rows] = await Chat.createChat(user1, user2);
    res.json(rows);
}

