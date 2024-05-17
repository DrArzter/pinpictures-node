const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use('/uploads/posts', express.static('uploads/posts'));
app.use('/uploads/users', express.static('uploads/users'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
