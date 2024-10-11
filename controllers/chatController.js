const { timeStamp } = require('console');
const Chat = require('../models/chatModel');
const getIdbyToken = require('../utils/getIdbyToken');
const getUserByID = require('../utils/getUserById');
const events = require('events');
const ws = require('ws');

const emitter = new events.EventEmitter();

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
        const user2 = req.body.secondUserId;

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

exports.getMessages = async (req, res) => {
    emitter.once('msg_'+req.params.id, async (message, chatId) => {
    try {
        if (chatId == req.params.id) {
            res.status(200).json(message);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });
};

exports.uploadMessage = async (req, res) => {
    try {
        const userId = await getIdbyToken(req.headers.authorization);
        const chatId  = req.params.id;
        const message = req.body.message.text;
        const uploaded = await Chat.uploadMessage(userId, chatId, message);
        if (!uploaded) {
            res.status(500).json({ error: 'Server error' });
            return;
        } else {
            //response = await Chat.getChatById(chatId);
            emitter.emit('msg_'+chatId, uploaded[0], chatId);
            res.status(200).json({ message: 'Message uploaded successfully' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
