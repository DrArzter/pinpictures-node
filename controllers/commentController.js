const Comment = require('../models/commentModel');
const jwt = require('jsonwebtoken');
const { env } = require('process');
const getIdbyToken = require('../utils/getIdbyToken');

exports.getAllComments = async (req, res) => {
    const [rows] = await Comment.getAllComments();
    res.json(rows);
}

exports.createComment = async (req, res) => {
    try {
        const { postid, comment } = req.body;
        const userid = await getIdbyToken(req.headers.authorization);
        const newComment = { userid, postid, comment, picpath: null };
        const result = await Comment.createComment(newComment);
        newComment.id = result.insertId;
        res.status(201).json({ newComment });
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