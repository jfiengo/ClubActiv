const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create Post
router.post('/', async (req, res) => {
    const { user, imageUrl, description, activityType, location } = req.body;
    try {
        let post = new Post({ user, imageUrl, description, activityType, location });
        await post.save();
        res.status(201).send('Post created');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get Posts by Location
router.get('/', async (req, res) => {
    const { lng, lat } = req.query;
    try {
        let posts = await Post.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], 10 / 3963.2] // 10 miles radius
                }
            }
        });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
