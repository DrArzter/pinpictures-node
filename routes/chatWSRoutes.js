const express = require('express');
const router = express.Router();
const chatWSController = require('../controllers/chatWSController');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    chatWSController.handleWebSocket(ws, req); // Передаем WebSocket и запрос в контроллер
});

router.get('/', (req, res) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
    });
});

module.exports = router;
