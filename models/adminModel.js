const exp = require('constants');
const pool = require('../config/db');
const queries = require('./postQueries');

exports.banUser = async (userid) => {
    const [rows] = await pool.query("UPDATE users SET banned = 1 WHERE id = ?", [userid]);
    return rows;
};

exports.unbanUser = async (userid) => {
    const [rows] = await pool.query("UPDATE users SET banned = 0 WHERE id = ?", [userid]);
    return rows;
};

exports.changeUsername = async (username, id) => {
    const [rows] = await pool.query("UPDATE users SET name = ? WHERE id = ?", [username, id]);
    return rows;
};

exports.changeEmail = async (email, id) => {
    const [rows] = await pool.query("UPDATE users SET email = ? WHERE id = ?", [email, id]);
    return rows;
};

exports.setDefaultAvatar = async (id) => {
    const [rows] = await pool.query("UPDATE users SET avatar = ? WHERE id = ?", [id, `https://ui-avatars.com/api/?name=${name}&background=ACACAC&color=fff`]);
    return rows;
}

exports.setDefaulBackground = async (id) => {
    const [rows] = await pool.query("UPDATE users SET bgpicpath = ? WHERE id = ?", [id, `https://ui-avatars.com/api/?name=${name}&background=ACACAC&color=fff`]);
    return rows;
}


exports.wipeUserData = async (userid) => {
    const [friendsRows] = await pool.query("DELETE IGNORE FROM friends WHERE userid = ?", [userid]);
    let bucketKeys = [];
    const [allPosts] = await pool.query("SELECT id FROM posts WHERE userid = ?", [userid]);

    if (allPosts.length > 0) {
        const [bucketKeysRows] = await pool.query("SELECT bucketkey FROM images_in_posts WHERE postid IN (?)", [allPosts.map(post => post.id)]);

        if (bucketKeysRows.length > 0) {
            bucketKeys = bucketKeysRows.map(row => row.bucketkey);

            await pool.query("DELETE IGNORE FROM images_in_posts WHERE postid IN (?)", [allPosts.map(post => post.id)]);

        }
    }

    const [messagesRows] = await pool.query("DELETE IGNORE FROM messages_in_chats WHERE userid = ?", [userid]);

    const [usersChatRows] = await pool.query("DELETE IGNORE FROM users_in_chats WHERE userid = ?", [userid]);

    const [likesRows] = await pool.query("DELETE IGNORE FROM likes WHERE userid = ?", [userid]);

    const [commentsRows] = await pool.query("DELETE IGNORE FROM comments WHERE userid = ?", [userid]);

    const [postRows] = await pool.query("DELETE IGNORE FROM posts WHERE userid = ?", [userid]);

    const [userRows] = await pool.query("DELETE IGNORE FROM users WHERE id = ?", [userid]);
    return bucketKeys;
};

exports.getUsers = async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

exports.getPosts = async () => {
    const [posts] = await pool.query("SELECT * FROM posts");
    const [likes] = await pool.query("SELECT * FROM likes");
    const [comments] = await pool.query("SELECT * FROM comments");
    return { posts, likes, comments };
}

exports.setBananaLevel = async (bananaLevel, id) => {
    console.log(`UPDATE users SET bananalevel = ${bananaLevel} WHERE id = ${id}`);
    const [rows] = await pool.query("UPDATE users SET bananalevel = ? WHERE id = ?", [bananaLevel, id]);
    return rows;
}