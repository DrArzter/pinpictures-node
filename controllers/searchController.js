const Search = require('../models/searchModel');

exports.search = async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        console.log('Search term:', searchTerm);

        const results = await Search.search(searchTerm);

        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
};
