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

export default router;
