const pool = require('../config/db');

exports.getAllPosts = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating, 
            u.name AS author, 
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', u.name,
                        'comment', c.comment
                    )
                ) 
                FROM comments c 
                JOIN users u ON c.authorid = u.id
                WHERE c.postid = p.id
            ) AS comments,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', i.id,
                        'picpath', i.picpath
                    )
                )
                FROM images_in_posts i
                WHERE i.postid = p.id
            ) AS images
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

exports.createImageInPost = async (image) => {
    await pool.query('INSERT INTO images_in_posts SET ?', image);
};

exports.getPostById = async (id) => {
    const [rows] = await pool.query(`
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating, 
            u.name AS author, 
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', u.name,
                        'comment', c.comment
                    )
                ) 
                FROM comments c 
                JOIN users u ON c.authorid = u.id
                WHERE c.postid = p.id
            ) AS comments,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', i.id,
                        'picpath', i.picpath
                    )
                )
                FROM images_in_posts i
                WHERE i.postid = p.id
            ) AS images
        FROM 
            posts p 
        JOIN 
            users u ON p.authorid = u.id 
        WHERE
            p.id = ?
        GROUP BY 
            p.id
        ORDER BY 
            p.id DESC
    `, [id]);
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

