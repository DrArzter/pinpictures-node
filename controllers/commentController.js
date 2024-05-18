const Comment = require('../models/commentModel');
const jwt = require('jsonwebtoken');
const { env } = require('process');
const checkToken = require('../utils/getIdbyToken');

exports.getAllComments = async (req, res) => {
    const [rows] = await Comment.getAllComments();
    res.json(rows);
}

exports.createComment = async (req, res) => {
    try {
        const { postid, comment } = req.body;
        const authorid = await checkToken(req.headers.authorization);
        console.log(authorid);
        const newComment = { authorid, postid, comment, picpath: null };
        const result = await Comment.createComment(newComment);
        res.status(201).json({ id: result.insertId, ...newComment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getCommentById = async (req, res) => {
        const { id } = req.params;
        const [rows] = await Comment.getCommentById(id);
        res.json(rows);
    }

    exports.deleteComment = async (req, res) => {
        const { id } = req.params;
        const result = await Comment.deleteComment(id);
        res.json(result);
    }