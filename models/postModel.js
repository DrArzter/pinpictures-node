const pool = require('../config/db');

exports.getAllPosts = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating, 
            p.picpath, 
            u.name AS author, 
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', u.name,
                        'content', c.content
                    )
                ) 
                FROM comments c 
                JOIN users u ON c.authorid = u.id
                WHERE c.postid = p.id
            ) AS comments
        FROM 
            posts p 
        JOIN 
            users u ON p.authorid = u.id 
        ORDER BY 
            p.id DESC;
    `);
    return rows;
};

exports.createPost = async (post) => {
    const [result] = await pool.query('INSERT INTO posts SET ?', post);
    return result.insertId;
};

exports.getPostById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
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

