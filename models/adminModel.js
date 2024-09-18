const exp = require('constants');
const pool = require('../config/db');
const queries = require('./postQueries');

exports.banUser = async (userid) => {
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