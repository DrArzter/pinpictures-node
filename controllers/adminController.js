const Admin = require('../models/adminModel');
const fs = require('fs').promises;
const checkToken = require('../utils/getIdbyToken');
const { handleError } = require('../utils/errorHandler');
const { uploadFiles, deleteFiles } = require('../utils/s3Module');
const { stat } = require('fs');

exports.banUser = async (req, res) => {
    try {
        const { userid } = req.body;
        const bucketKeys = await Admin.banUser(userid);
        if (bucketKeys.length > 0) {
            deleteFiles(bucketKeys);
        }

        res.status(200).json({ staus: 'success', message: 'User banned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};