const Post = require('../models/postModel');
const fs = require('fs');
const checkToken = require('../utils/getIdbyToken');
const { handleError } = require('../utils/errorHandler');

exports.searchPosts = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const posts = await Post.searchPosts(searchTerm);
        res.json(posts);
    } catch (error) {
        handleError(res, error, "Error searching posts");
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (err) {
        handleError(res, err, "Error retrieving posts");
    }
};

exports.createPost = async (req, res) => {
    try {
        const formData = req.body;
        const images = req.files;
        formData.userid = await checkToken(req.headers.authorization);

        if (!formData || !images || images.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const post = {
            name: formData.name,
            description: formData.description,
            userid: formData.userid
        };
        const newPostId = await Post.createPost(post);

        // Move image handling to a separate utility if complex
        await Promise.all(images.map(async (image) => {
            const fileExt = image.originalname.split('.').pop();
            const tempPath = image.path;
            const newPath = `${tempPath}.${fileExt}`;
            fs.renameSync(tempPath, newPath);
            await Post.createImageInPost({ postid: newPostId, picpath: newPath });
        }));

        const newPost = await Post.getPostById(newPostId);
        res.status(201).json(newPost);
    } catch (err) {
        handleError(res, err, "Error creating post");
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        handleError(res, err, "Error retrieving post");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Post.deletePost(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        handleError(res, err, "Error deleting post");
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const affectedRows = await Post.updatePost(id, updates);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        handleError(res, err, "Error updating post");
    }
};

exports.updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const affectedRows = await Post.updateRating(id, rating);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (err) {
        handleError(res, err, "Error updating rating");
    }
};
