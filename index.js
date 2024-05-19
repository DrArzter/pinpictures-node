const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();

app.use('/uploads/posts', express.static('uploads/posts'));
app.use('/uploads/users', express.static('uploads/users'));
app.use('/uploads/comments', express.static('uploads/comments'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    process.env.CORS_ORIGIN
        ? { origin: process.env.CORS_ORIGIN }
        : undefined
));

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/chats', chatRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Connected to database with host: ' + process.env.DB_HOST + ', user: ' + process.env.DB_USER + ', database: ' + process.env.DB_NAME);
});
