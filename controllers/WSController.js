const jwt = require('jsonwebtoken');
const Chat = require('../models/WSModel');
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



        ws.on('message', async (message) => {
            const data = JSON.parse(message);
    
            switch (data.type) {
                case 'createChat':
                    try {
                        const user1 = decoded.id;
                        const user2 = data.recipientId;
                        const chatExists = await Chat.checkPrivateChatExists(user1, user2)
                        console.log(chatExists);
                        if (chatExists) {
                            ws.send(JSON.stringify({ type: 'chatExists', id: chatExists }));
                            return;
                        }
                        const chatId = await Chat.createChat({ user1, user2 });
                        ws.send(JSON.stringify({ type: 'chatCreated', id: chatId }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message:  `Error creating chat` } }));
                    }
                    break;
                case 'getAllChats':
                    try {
                        const userId = decoded.id;
                        const chats = await Chat.getChatsByUserId(userId);
                        ws.send(JSON.stringify({ type: 'allChats', chats }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Error fetching chats'} }));
                    }
                    break;
    
                case 'getChatMessages':
                    try {
                        const chatId = data.chatId;
                        const isInChat = await Chat.isUserInChat(decoded.id, chatId);
    
                        if (!isInChat) {
                            ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Access denied'} }));
                            return;
                        }
    
                        const messages = await Chat.getMessagesByChatId(chatId);
                        ws.send(JSON.stringify({ type: 'chatMessages', chatId, messages }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Error fetching messages'} }));
                    }
                    break;
    
                case 'sendMessage':
                    try {
                        const { chatId: inputChatId, recipientId, message } = data.message;
                        
                        let chatId = inputChatId;
                        
                        // Если chatId не передан, проверяем существование или создаем новый чат
                        if (!inputChatId) {
                            chatId = await Chat.getOrCreatePrivateChat(decoded.id, recipientId);
                        }
    
                        // Проверяем, есть ли пользователь в чате
                        const isUserInChat = await Chat.isUserInChat(decoded.id, chatId);
                        if (!isUserInChat) {
                            ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Access denied'} }));
                            return;
                        }
    
                        // Сохраняем и отправляем сообщение
                        const savedMessage = await Chat.saveMessage({
                            chatId,
                            senderId: decoded.id,
                            message: message,
                        });
    
                        const usersInChat = await Chat.getUsersInChat(chatId);
    
                        usersInChat.forEach(userId => {
                            if (connectedClients[userId]) {
                                connectedClients[userId].forEach(clientWs => {
                                    clientWs.send(JSON.stringify({ type: 'newMessage', chatId, message: savedMessage }));
                                });
                            }
                        });
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Error sending message'} }));
                    }
                    break;
    
                default:
                    ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Invalid type'} }));
            }
        });



    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Token expired'} }));
        } else {
            ws.send(JSON.stringify({ type: 'notification', message: {message_type: 'error', message: 'Invalid token'} }));
        }
        ws.close();
    }
}

module.exports = { handleWebSocket, emitter };
