const express = require('express');
const router = express.Router();
const chatWSController = require('../controllers/WSController');
const authMiddleware = require('../middlewares/authMiddleware');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    try {
        chatWSController.handleWebSocket(ws, req);
    } catch (error) {
        console.error('Error handling WebSocket connection:', error);
        ws.close();
    }
});

router.get('/', authMiddleware, (req, res) => { 
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
    });
});

module.exports = router; 