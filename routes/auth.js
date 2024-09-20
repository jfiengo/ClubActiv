// routes/auth.js
import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Handle registration form submission
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('User already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Redirect to login page
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal server error.');
  }
});

// Handle login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).render('login', { error: 'Username and password are required.' });
    }

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid username or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid username or password.' });
    }

    // Successful authentication
    // Save user info to the session
    req.session.userId = user._id;

    // Redirect to the dashboard
    res.redirect('/protected/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { error: 'Internal server error.' });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  console.log('Logout route called');
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle the error appropriately
      return res.status(500).send('Internal Server Error');
    }
    // Clear the cookie
    res.clearCookie('connect.sid'); // Use the name of your session cookie
    // Redirect to login page
    res.redirect('/auth/login');
  });
});

// Render Registration Form
router.get('/register', (req, res) => {
  res.render('register');
});

// Render Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// After successful login or registration
router.get('/dashboard', (req, res) => {
  res.render('dashboard'); // Renders 'views/dashboard.ejs'
});

export default router;
