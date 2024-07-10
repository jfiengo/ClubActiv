const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = new User({ username, email, password });
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
