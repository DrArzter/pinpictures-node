const Post = require('../models/postModel');
const fs = require('fs').promises;
const getIdbyToken = require('../utils/getIdbyToken');
const { handleError } = require('../utils/errorHandler');
const { uploadFiles, deleteFiles } = require('../utils/s3Module');
const { stat } = require('fs');

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

    const page = parseInt(req.query.page)

    try {
        const posts = await Post.getAllPosts(page);
        res.status(200).json(posts);
    } catch (err) {
        handleError(res, err, "Error retrieving posts");
    }
};

exports.createPost = async (req, res) => {
    try {
        const formData = req.body;
        const images = req.files;
        formData.userid = await getIdbyToken(req.headers.authorization);

        console.log(images.length);
        if (images.length > 10) {
            return res.status(400).json({ status: 'error', message: 'You can only upload up to 10 images' });
        }

        if (!formData || !images || images.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Invalid request data' });
        }

        const post = {
            name: formData.name,
            description: formData.description,
            userid: formData.userid,
        };
        const newPostId = await Post.createPost(post);

        if (!newPostId) {
            return res.status(500).json({ status: 'error', message: 'Failed to create post' });
        }


        // Process images and prepare them for upload
        const processedImages = await Promise.all(images.map(async (image) => {
            const filefffTypes = /jpeg|jpg|png|gif|webp/;
            const fileExt = image.originalname.split('.').pop();
            const mimeType = filefffTypes.test(image.mimetype);
            const extname = filefffTypes.test(fileExt.toLowerCase());
        
            if (!mimeType || !extname) {
                return { error: "Wrong file type"};
            }
            const tempPath = image.path;
            const randomString = Math.random().toString(36).substr(2, 10);
            const newPath = `${tempPath}.${fileExt}`;

            try {
                await fs.rename(tempPath, newPath);
            } catch (err) {
                console.error(`Error renaming temporary file: ${tempPath}`, err);
                return { error: "Server error" };
            }
            const fileContent = await fs.readFile(newPath);


            return {
                filename: `posts/${newPostId}-${randomString}-${Date.now()}.${fileExt}`,
                content: fileContent,
                path: newPath
            };
        }));

        for (let i = 0; i < processedImages.length; i++) {
            if (processedImages[i]['error']) {
                res.status(500).json({ status: 'error', message: processedImages[i]['error'] });
                return;
            }
        }
        const res2 = await uploadFiles(processedImages);
        await Promise.all(processedImages.map(async (file) => {
            try {
                await fs.unlink(file.path);
            } catch (err) {
                console.error(`Error deleting temporary file: ${file.path}`, err);
                res.status(500).json({ status: 'error', message:  'Failed to upload some images' });
                return;
            }
        }));
        for (let i = 0; i < res2.length; i++) {
            await Post.createImageInPost({ postid: newPostId, picpath: res2[i].Location, bucketkey: res2[i].Key });
        }
        const newPost = await Post.getPostById(newPostId);
        res.status(201).json({ status: 'success', message: 'Post created successfully', newPost: newPost });
    } catch (err) {
        handleError(res, err, "Error creating post");
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getPostById(id);
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        handleError(res, err, "Error retrieving post");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        let bucketKeys = await Post.deletePost(id);
        if (bucketKeys.length === 0) {
           res.status(404).json({ status: 'error', message: 'Post not found' });
           return;
        }
        
        bucketKeys = bucketKeys.map((key) => key.bucketkey);
        deleteFiles(bucketKeys);
        
        res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
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
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        res.status(200).json({ status: 'success', message: 'Post updated successfully' });
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
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        res.status(200).json({ status: 'success', message: 'Rating updated successfully' });
    } catch (err) {
        handleError(res, err, "Error updating rating");
    }
};

exports.likePost = async (req, res) => {
    try {
        const id = await getIdbyToken(req.headers.authorization);
        const like = {
            userid: id,
            postid: req.params.id
        }
        const result = await Post.likePost(like);
        if (result === 0) {
            return res.status(400).json({ status: 'error', message: 'Something went wrong' });
        }
        res.status(200).json({ status: 'success', message: result === -1 ? 'unliked' : 'liked' });
    } catch (err) {
        handleError(res, err, "Error liking post");
    }
}