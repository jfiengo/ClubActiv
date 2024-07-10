const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create Group
router.post('/', async (req, res) => {
    const { name, description, activityType, members } = req.body;
    try {
        let group = new Group({ name, description, activityType, members });
        await group.save();
        res.status(201).send('Group created');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get Groups by Activity Type
router.get('/', async (req, res) => {
    const { activityType } = req.query;
    try {
        let groups = await Group.find({ activityType });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
