const pool = require('../config/db');
const queries = require('./postQueries');

exports.getAllPosts = async () => {
    const [rows] = await pool.query(queries.GET_ALL_POSTS);
    return rows;
};

exports.createPost = async (post) => {
    const [result] = await pool.query('INSERT INTO posts SET ?', post);
    return result.insertId;
};

exports.createImageInPost = async (image) => {
    await pool.query('INSERT INTO images_in_posts SET ?', image);
};

exports.getPostById = async (id) => {
    const [rows] = await pool.query(queries.GET_POST_BY_ID, [id]);
    return rows[0];
};

exports.deletePost = async (id) => {
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
};

exports.updatePost = async (id, post) => {
    const [result] = await pool.query('UPDATE posts SET ? WHERE id = ?', [post, id]);
    return result.affectedRows;
};

exports.updateRating = async (id, rating) => {
    const [result] = await pool.query('UPDATE posts SET rating = ? WHERE id = ?', [rating, id]);
    return result.affectedRows;
};

exports.searchPosts = async (searchTerm) => {
    const likeTerm = `%${searchTerm}%`;
    const [rows] = await pool.query(queries.SEARCH_POSTS, [likeTerm, likeTerm, likeTerm]);
    return rows;
};