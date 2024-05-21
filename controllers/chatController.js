const Chat = require('../models/chatModel');
const getIdbyToken = require('../utils/getIdbyToken');

exports.getChatsByUserId = async (req, res) => {
    try {
        const userId = await getIdbyToken(req.headers.authorization);
        const chats = await Chat.getChatsByUserIdFromDb(userId);
        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createChat = async (req, res) => {
    try {
        const user1 = await getIdbyToken(req.headers.authorization);
        const { user2 } = req.body;
        const chatId = await Chat.createChat({ user1, user2 });
        res.status(201).json({ chatId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.getChatById(id);
        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.uploadMessage = async (req, res) => {
    try {
        const userId = await getIdbyToken(req.headers.authorization);
        const chatId  = req.params.id;
        const message = req.body.message.text;
        console.log(userId, chatId, message);
        const uploaded = await Chat.uploadMessage(userId, chatId, message);
        if (!uploaded) {
            res.status(404).json({ error: 'Chat not found' });
            return;
        } else {
            response = await Chat.getChatById(chatId);
            console.log(response);
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
