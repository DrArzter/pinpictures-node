const pool = require('../config/db');
const queries = require('./searchQueries');

exports.search = async (searchTerm) => {
    const likeTerm = `%${searchTerm}%`;

    const [posts, users] = await Promise.all([
        pool.query(queries.SEARCH_POSTS, [likeTerm, likeTerm, likeTerm]),
        pool.query(queries.SEARCH_USERS, [likeTerm])
    ]);

    return {
        posts: posts[0],
        users: users[0]
    };
};
