const { timeStamp } = require('console');
const Chat = require('../models/chatModel');
const getIdbyToken = require('../utils/getIdbyToken');
const getUserByID = require('../utils/getUserById');
const events = require('events');
const ws = require('ws');

const emitter = new events.EventEmitter();

exports.handleWebSocket = async (ws, req) => {
    console.log('WebSocket connection established');
    ws.send(JSON.stringify({ type: 'connected' }));
    console.log(req.baseUrl)
    if (req.baseUrl === '/ws/chats') {
        handleChats(ws, req);
    }
};

function handleChats(ws, req) {
    ws.send(JSON.stringify({ type: 'getAllChats', chatsIds: [1, 2, 3], lastMessagesInChats: {'1': 'hello', '2': 'hello', '3': 'hello'} }));


    /* TODO Отправка новых сообщений пользователю из разных чатов */
    ws.send(JSON.stringify({ type: 'recvMessage', chatId: 1, message: 'hello' }));
    ws.send(JSON.stringify({ type: 'recvMessage', chatId: 2, message: 'Privet' }));
    ws.send(JSON.stringify({ type: 'recvMessage', chatId: 3, message: 'Dinahu' }));

    
    /* TODO Изменение сообщений у пользоватея в разных чатах */
    ws.send(JSON.stringify({ type: 'editMessage', chatId: 1, messageId: 1, message: 'hello' }));
    ws.send(JSON.stringify({ type: 'editMessage', chatId: 2, messageId: 1, message: 'Privet' }));
    ws.send(JSON.stringify({ type: 'editMessage', chatId: 3, messageId: 1, message: 'Dinahu' }));
    
    /* TODO Удаление сообщений у пользоватея в разных чатах */
    ws.send(JSON.stringify({ type: 'removeMessage', chatId: '1', messageId: 1 }));
    ws.send(JSON.stringify({ type: 'removeMessage', chatId: '2', messageId: 1 }));
    ws.send(JSON.stringify({ type: 'removeMessage', chatId: '3', messageId: 1 }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'getAllChats':
                break;

            case 'sendMessage':
                console.log('Sending message:', data);
                break;
        }
    });
}