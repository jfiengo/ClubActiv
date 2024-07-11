import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).send('Username, password, and email are required');
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send('Username already exists');
    }

    const user = new User({ username, password, email });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Update user profile by username
router.put('/profile/:username', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { username: req.params.username },
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      res.json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
