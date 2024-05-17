const Post = require('../models/postModel');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const formData = req.body;
    const image = req.file;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        const { id } = jwt.verify(token, jwtSecretKey);
        formData.authorid = id;
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (formData && image) {
        const post = {
            name: formData.name,
            description: formData.description,
            cost: formData.cost,
            authorid: formData.authorid,
            picpath: image.filename
        };

        try {
            const newPostId = await Post.createPost(post);
            res.status(201).json({ id: newPostId, ...post });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid request data' });
    }
};

// Дополнительные методы для получения, обновления и удаления постов
