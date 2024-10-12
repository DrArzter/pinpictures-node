const Admin = require('../models/adminModel');
const { deleteFiles } = require('../utils/s3Module');

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

exports.getUsers = async (req, res) => {
    try {
        const users = await Admin.getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await Admin.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.userAction = async (req, res) => {
    try {
        const action = req.body.action;

        switch(action) {

            case 'setBananaLevel':
                try {
                    const id = req.params.id;
                    const value = req.body.value;
                    const result = await Admin.setBananaLevel(value, id);
                    res.status(200).json(result);
                    return;
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                

            case 'banUser':
                
                try {
                    const userid = req.params.id;
                    const rows = await Admin.banUser(userid);
                    console.log(rows.affectedRows);
                    if (rows.affectedRows > 0) {
                        res.status(200).json({ staus: 'success', message: 'User banned successfully' });
                    } else {
                        res.status(200).json({ staus: 'success', message: 'User already banned' });
                    }
                    return;

                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'unbanUser':
                try {
                    const userid = req.params.id;
                    const rows = await Admin.unbanUser(userid);
                    console.log(rows.affectedRows);
                    if (rows.affectedRows > 0) {
                        res.status(200).json({ staus: 'success', message: 'User banned successfully' });
                    } else {
                        res.status(200).json({ staus: 'success', message: 'User already banned' });
                    }
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'changeUsername':
                try {
                    const { userid, username } = req.body;
                    const result = await Admin.changeUsername(userid, username);
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'changeEmail':
                try {
                    const { userid, email } = req.body;
                    const result = await Admin.changeEmail(userid, email);
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'changePassword':
                try {
                    const { userid, password } = req.body;
                    const result = await Admin.changePassword(userid, password);
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'setDefaultAvatar':
                try {
                    const { userid } = req.body;
                    const result = await Admin.setDefaultAvatar(userid);
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'setDefaultBackground':
                try {
                    const { userid } = req.body;
                    const result = await Admin.setDefaultBackground(userid);
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
            
            case 'clearPosts':
                try {
                    const result = await Admin.clearPosts();
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'clearComments':
                try {
                    const result = await Admin.clearComments();
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            case 'clearChats':
                try {
                    const result = await Admin.clearChats();
                    res.status(200).json(result);
                    return;
                } catch(error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

            default:
                res.status(400).json({ error: 'Invalid action' });
                return;
            
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}