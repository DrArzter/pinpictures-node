module.exports = {
    GET_ALL_POSTS: `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating,
            p.created_at,
            u.name AS author,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', cu.name,
                        'comment', c.comment,
                        'created_at', c.created_at
                    )
                ) 
                FROM comments c 
                JOIN users cu ON c.userid = cu.id
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
            users u ON p.userid = u.id 
        ORDER BY 
            p.id DESC;
    `,

    GET_POST_BY_ID: `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating,
            p.created_at,
            u.name AS author, 
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', u.name,
                        'comment', c.comment,
                        'created_at', c.created_at
                    )
                ) 
                FROM comments c 
                JOIN users u ON c.userid = u.id
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
            users u ON p.userid = u.id 
        WHERE
            p.id = ?
        GROUP BY 
            p.id
        ORDER BY 
            p.id DESC;
    `,

    SEARCH_POSTS: `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.rating,
            p.created_at,
            u.name AS author,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'author', u.name,
                        'comment', c.comment,
                        'created_at', c.created_at
                    )
                ) 
                FROM comments c 
                JOIN users u ON c.userid = u.id
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
            users u ON p.userid = u.id 
        WHERE
            p.name LIKE ? OR
            p.description LIKE ? OR
            u.name LIKE ?
        ORDER BY 
            p.id DESC;
    `,
};
