const jwt = require('jsonwebtoken');
const Chat = require('../models/chatWSModel');
const events = require('events');
const emitter = new events.EventEmitter();

const connectedClients = {};

async function handleWebSocket(ws, req) {
    const token = req.cookies['token'];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!connectedClients[userId]) {
            connectedClients[userId] = new Set();
        }
        connectedClients[userId].add(ws);

        ws.on('close', () => {
            connectedClients[userId].delete(ws);
            if (connectedClients[userId].size === 0) {
                delete connectedClients[userId];
            }
        });

        ws.send(JSON.stringify({ type: 'connected', message: 'Authenticated successfully' }));

        if (req.baseUrl === '/api/ws/chats') {
            await handleChats(ws, req, decoded);
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            ws.send(JSON.stringify({ type: 'error', message: 'Session expired, please log in again' }));
        } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
        }
        ws.close();
    }
}

async function handleChats(ws, req, decoded) {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        switch (data.type) {

            case 'getAllChats':

                const userId = decoded.id;
                const chats = await Chat.getChatsByUserId(userId);
                ws.send(JSON.stringify({ type: 'allChats', chats }));
                break;

            case 'getChatMessages':

                const chatId = data.chatId;
                const isInChat = await Chat.isUserInChat(decoded.id, chatId);

                if (!isInChat) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Access denied' }));
                    return;
                }

                const messages = await Chat.getMessagesByChatId(chatId);
                ws.send(JSON.stringify({ type: 'chatMessages', chatId, messages }));
                break;

            case 'sendMessage':

                const isUserInChat = await Chat.isUserInChat(decoded.id, data.message.chatId);
                if (!isUserInChat) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Access denied' }));
                    return;
                }

                const savedMessage = await Chat.saveMessage({
                    chatId: data.message.chatId,
                    senderId: decoded.id,
                    message: data.message.message,
                });

                const usersInChat = await Chat.getUsersInChat(data.message.chatId);

                usersInChat.forEach(userId => {
                    if (connectedClients[userId]) {
                        connectedClients[userId].forEach(clientWs => {
                            clientWs.send(JSON.stringify({ type: 'newMessage', chatId: data.message.chatId, message: savedMessage }));
                        });
                    }
                });
                
                break;

            default:
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
    });
}


module.exports = { handleWebSocket, emitter };
