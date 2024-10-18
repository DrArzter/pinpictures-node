const Chat = require('../models/chatWSModel');

module.exports = async (req, res, next) => {
    const token = req.cookies['token'];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const chatId = req.params.chatId || req.body.chatId;

        if (!chatId) {
            return res.status(400).json({ message: 'Chat ID is required' });
        }

        const isInChat = await Chat.isUserInChat(userId, chatId);

        if (!isInChat) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
