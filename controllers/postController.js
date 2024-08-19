const Post = require('../models/postModel');
const { env } = require('process');
const fs = require('fs');
const checkToken = require('../utils/getIdbyToken');


exports.searchPosts = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const posts = await Post.searchPosts(searchTerm);
        res.json(posts);
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).send("Server Error");
    }
};

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
    const images = req.files;
    formData.authorid = await checkToken(req.headers.authorization);
    if (formData && images && images.length > 0) {
        try {
            const post = {
                name: formData.name,
                description: formData.description,
                authorid: formData.authorid
            };
            const newPostId = await Post.createPost(post);

            for (const image of images) {
                const fileExt = image.originalname.split('.').pop();
                const tempPath = image.path;
                const newPath = image.path + '.' + fileExt;
                fs.renameSync(tempPath, newPath);
                await Post.createImageInPost({ postid: newPostId, picpath: newPath });
            }

            const newPost = await Post.getPostById(newPostId);
            res.status(201).json(newPost);
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
        const result = await Post.updatePost(id, { name, description, cost });
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