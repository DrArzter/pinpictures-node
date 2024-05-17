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

exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.getPostById(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Post.deletePost(id);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ message: 'Post deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { name, description, cost } = req.body;
    try {
        const result = await Post.updatePost(id, name, description, cost);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ message: 'Post updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const result = await Post.updateRating(id, rating);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ message: 'Rating updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Дополнительные методы для получения, обновления и удаления постов
