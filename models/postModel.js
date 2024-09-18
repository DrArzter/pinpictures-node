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

exports.checkAccessToPost = async (userid, postid) => {
    const [rows] = await pool.query(queries.CHECK_ACESS_TO_POST, [userid, postid]);
    return rows;
};

exports.deletePost = async (id) => {
    const [bucketKeys] = await pool.query("SELECT bucketkey FROM images_in_posts WHERE postid = ?", [id]);
    const [result2] = await pool.query('DELETE FROM images_in_posts WHERE postid = ?', [id]);
    const [result3] = await pool.query('DELETE FROM likes WHERE postid = ?', [id]);
    const [csss] = await pool.query('DELETE FROM comments WHERE postid = ?', [id]);
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return bucketKeys;
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

exports.likePost = async (post) => {
    try{
        const currentLikeState = (await pool.query('SELECT * FROM likes WHERE userid = ? AND postid = ?', [post.userid, post.postid]))[0].length;

        if (currentLikeState) {
            await pool.query('DELETE FROM likes WHERE userid = ? AND postid = ?', [post.userid, post.postid]);
            return -1;
        }
        const [result] = await pool.query('INSERT INTO likes SET ?', post);
        return 1;
    } catch (error) {
        return 0;
    }
};