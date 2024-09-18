const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();

app.use(morgan('dev'));

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
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
    console.log('Connected to database with host: ' + process.env.DB_HOST + ', user: ' + process.env.DB_USER + ', database: ' + process.env.DB_NAME);
});
